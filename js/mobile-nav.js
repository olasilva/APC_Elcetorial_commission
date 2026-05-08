/**
 * SENTINEL Mobile Navigation - Simplified v4.0
 * Add this script before </body> in every page
 */
(function() {
    'use strict';

    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function() {
        setupMobileNavigation();
    });

    function setupMobileNavigation() {
        var isMobile = window.innerWidth <= 968;
        
        if (!isMobile) {
            // Clean up mobile elements on desktop
            removeMobileElements();
            return;
        }

        // Find existing elements
        var sidebar = document.querySelector('.sidebar');
        var topNav = document.querySelector('.top-nav');
        
        if (!sidebar || !topNav) return;

        // ========== HAMBURGER BUTTON ==========
        var hamburger = document.querySelector('.hamburger-btn');
        if (!hamburger) {
            hamburger = document.createElement('button');
            hamburger.className = 'hamburger-btn';
            hamburger.setAttribute('aria-label', 'Toggle menu');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            
            var navBrand = topNav.querySelector('.nav-brand');
            if (navBrand && navBrand.nextSibling) {
                topNav.insertBefore(hamburger, navBrand.nextSibling);
            } else if (navBrand) {
                navBrand.parentNode.insertBefore(hamburger, navBrand.nextSibling);
            } else {
                topNav.insertBefore(hamburger, topNav.firstChild);
            }
        }

        // ========== OVERLAY ==========
        var overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }

        // ========== BOTTOM NAV ==========
        if (!document.querySelector('.mobile-bottom-nav')) {
            var currentPage = getCurrentPage();
            var bottomNav = document.createElement('nav');
            bottomNav.className = 'mobile-bottom-nav';
            bottomNav.innerHTML = 
                '<div class="bottom-nav-inner">' +
                    createBottomNavItem('fa-compass', 'Home', 'dashboard.html', currentPage === 'dashboard') +
                    createBottomNavItem('fa-vote-yea', 'Elections', 'primaries.html', currentPage === 'primaries') +
                    createBottomNavItem('fa-database', 'Registry', 'candidates.html', currentPage === 'candidates') +
                    createBottomNavItem('fa-chart-bar', 'Stats', 'analytics.html', currentPage === 'analytics') +
                    createBottomNavItem('fa-user', 'Profile', 'profile.html', currentPage === 'profile') +
                '</div>';
            document.body.appendChild(bottomNav);
        }

        // ========== EVENT LISTENERS ==========
        
        // Remove old listeners by cloning
        var newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        hamburger = newHamburger;

        var newOverlay = overlay.cloneNode(true);
        overlay.parentNode.replaceChild(newOverlay, overlay);
        overlay = newOverlay;

        // Add click handlers
        hamburger.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar(sidebar, overlay, hamburger);
        };

        overlay.onclick = function(e) {
            e.preventDefault();
            closeSidebar(sidebar, overlay, hamburger);
        };

        // Add click handlers to bottom nav items
        var bottomItems = document.querySelectorAll('.bottom-nav-item');
        bottomItems.forEach(function(item) {
            item.onclick = function() {
                var href = this.getAttribute('data-href') || this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (href) {
                    window.location.href = href;
                }
            };
        });

        // ========== STORE REFERENCES ==========
        window._sentinelSidebar = sidebar;
        window._sentinelOverlay = overlay;
        window._sentinelHamburger = hamburger;

        // ========== KEYBOARD SUPPORT ==========
        document.onkeydown = function(e) {
            if (e.key === 'Escape') {
                closeSidebar(sidebar, overlay, hamburger);
            }
        };

        // Adjust content padding for bottom nav
        var contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.style.paddingBottom = '80px';
        }
        document.body.style.paddingBottom = '60px';
    }

    function createBottomNavItem(icon, label, href, isActive) {
        return '<button class="bottom-nav-item' + (isActive ? ' active' : '') + '" ' +
               'onclick="window.location.href=\'' + href + '\'" ' +
               'aria-label="' + label + '">' +
               '<i class="fas ' + icon + '"></i>' +
               '<span>' + label + '</span>' +
               '</button>';
    }

    function getCurrentPage() {
        var path = window.location.pathname;
        var filename = path.split('/').pop().replace('.html', '');
        return filename || 'dashboard';
    }

    function toggleSidebar(sidebar, overlay, hamburger) {
        if (!sidebar) sidebar = window._sentinelSidebar || document.querySelector('.sidebar');
        if (!overlay) overlay = window._sentinelOverlay || document.querySelector('.sidebar-overlay');
        if (!hamburger) hamburger = window._sentinelHamburger || document.querySelector('.hamburger-btn');

        if (!sidebar) return;

        var isOpen = sidebar.classList.contains('mobile-open');

        if (isOpen) {
            closeSidebar(sidebar, overlay, hamburger);
        } else {
            openSidebar(sidebar, overlay, hamburger);
        }
    }

    function openSidebar(sidebar, overlay, hamburger) {
        if (!sidebar) return;
        
        sidebar.classList.add('mobile-open');
        
        if (overlay) {
            overlay.classList.add('show');
            overlay.style.display = 'block';
        }
        
        if (hamburger) {
            hamburger.innerHTML = '<i class="fas fa-times"></i>';
            hamburger.setAttribute('aria-label', 'Close menu');
        }
        
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }

    function closeSidebar(sidebar, overlay, hamburger) {
        if (!sidebar) return;
        
        sidebar.classList.remove('mobile-open');
        
        if (overlay) {
            overlay.classList.remove('show');
            overlay.style.display = 'none';
        }
        
        if (hamburger) {
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            hamburger.setAttribute('aria-label', 'Open menu');
        }
        
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }

    function removeMobileElements() {
        var hamburger = document.querySelector('.hamburger-btn');
        if (hamburger) hamburger.remove();

        var overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.remove();

        var bottomNav = document.querySelector('.mobile-bottom-nav');
        if (bottomNav) bottomNav.remove();

        var sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
            sidebar.style.transform = '';
        }

        var contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.style.paddingBottom = '';
        }

        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.paddingBottom = '';
    }

    // Handle window resize
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            var isMobile = window.innerWidth <= 968;
            var hasMobileNav = !!document.querySelector('.mobile-bottom-nav');

            if (isMobile && !hasMobileNav) {
                setupMobileNavigation();
            } else if (!isMobile && hasMobileNav) {
                removeMobileElements();
            }
        }, 300);
    });

})();