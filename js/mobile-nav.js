
(function() {
    // Create hamburger button if it doesn't exist
    function createHamburgerButton() {
        const topNav = document.querySelector('.top-nav, nav');
        if (!topNav) return;
        
        // Check if hamburger already exists
        if (topNav.querySelector('.hamburger-btn')) return;
        
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        
        // Insert before the first child of topnav
        const navBrand = topNav.querySelector('.nav-brand');
        if (navBrand) {
            navBrand.parentNode.insertBefore(hamburger, navBrand);
        } else {
            topNav.insertBefore(hamburger, topNav.firstChild);
        }
        
        return hamburger;
    }
    
    // Create sidebar overlay
    function createSidebarOverlay() {
        if (document.querySelector('.sidebar-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }
    
    // Create mobile bottom nav
    function createMobileBottomNav() {
        if (document.querySelector('.mobile-bottom-nav')) return;
        
        const bottomNav = document.createElement('nav');
        bottomNav.className = 'mobile-bottom-nav';
        bottomNav.innerHTML = `
            <div class="bottom-nav-items">
                <button class="bottom-nav-item active" onclick="window.location.href='dashboard.html'">
                    <i class="fas fa-th-large"></i>
                    <span>Dashboard</span>
                </button>
                <button class="bottom-nav-item" onclick="window.location.href='primaries.html'">
                    <i class="fas fa-vote-yea"></i>
                    <span>Primaries</span>
                </button>
                <button class="bottom-nav-item" onclick="window.location.href='candidates.html'">
                    <i class="fas fa-database"></i>
                    <span>Registry</span>
                </button>
                <button class="bottom-nav-item" onclick="window.location.href='delegate-vote.html'">
                    <i class="fas fa-check-circle"></i>
                    <span>Vote</span>
                </button>
                <button class="bottom-nav-item" onclick="window.location.href='admin.html'">
                    <i class="fas fa-cog"></i>
                    <span>Admin</span>
                </button>
            </div>
        `;
        document.body.appendChild(bottomNav);
        
        // Highlight current page
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const items = bottomNav.querySelectorAll('.bottom-nav-item');
        items.forEach(item => {
            const onclick = item.getAttribute('onclick') || '';
            if (onclick.includes(currentPage)) {
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    }
    
    // Initialize
    function init() {
        const hamburger = createHamburgerButton();
        const overlay = createSidebarOverlay();
        const sidebar = document.querySelector('.sidebar, aside');
        
        if (hamburger && sidebar) {
            // Toggle sidebar
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                sidebar.classList.toggle('mobile-open');
                overlay.classList.toggle('show');
                
                // Change icon
                const icon = hamburger.querySelector('i');
                if (sidebar.classList.contains('mobile-open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
            
            // Close on overlay click
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('show');
                hamburger.querySelector('i').className = 'fas fa-bars';
            });
            
            // Close on nav item click (mobile)
            sidebar.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth <= 968) {
                        sidebar.classList.remove('mobile-open');
                        overlay.classList.remove('show');
                        if (hamburger) {
                            hamburger.querySelector('i').className = 'fas fa-bars';
                        }
                    }
                });
            });
        }
        
        // Create bottom nav
        createMobileBottomNav();
    }
    
    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Close sidebar on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968) {
            const sidebar = document.querySelector('.sidebar, aside');
            const overlay = document.querySelector('.sidebar-overlay');
            const hamburger = document.querySelector('.hamburger-btn');
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (overlay) overlay.classList.remove('show');
            if (hamburger) hamburger.querySelector('i').className = 'fas fa-bars';
        }
    });
})();
