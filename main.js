(function() {
    "use strict";

    // ===== SECURITY: Sanitize strings =====
    function sanitize(str) {
        if (typeof str !== 'string') return '';
        const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#x27;', '/':'&#x2F;' };
        return str.replace(/[&<>"'\/]/g, c => map[c]);
    }

    // ===== BUSINESS HOURS: 9:00 AM - 9:00 PM =====
    const BUSINESS_OPEN_HOUR = 9;   // 9:00 AM
    const BUSINESS_CLOSE_HOUR = 21; // 9:00 PM (después de esta hora, cerrado)
    const SLOT_MINUTES = 30;        // franjas de citas cada 30 min

    // ===== DATA LAYER =====

    // Navigation items
    const navItems = [
        { label: 'Inicio', href: '#hero' },
        { label: 'Mensaje', href: '#mensaje' },
        { label: 'Servicios', href: '#servicios' },
        { label: 'Citas', href: '#citas' },
        { label: 'Ubicación', href: '#ubicacion' }
    ];

    // Social links
    const socialLinks = [
        { icon: 'fab fa-instagram', url: 'https://instagram.com/nacha.332023', label: 'Instagram', color: 'hover:text-pink-500' },
        { icon: 'fab fa-tiktok', url: 'https://tiktok.com/@cea.versatil', label: 'TikTok', color: 'hover:text-black' },
        { icon: 'fab fa-youtube', url: 'https://youtube.com/@lavozsonora6892?si=XzjDysiyLXAv7STs', label: 'YouTube', color: 'hover:text-red-600' }
    ];

    // Categories
    const categories = [
        { id: 'todas', label: 'Todas' },
        { id: 'unas', label: '💅 Uñas' },
        { id: 'extensiones', label: '💇 Extensiones' },
        { id: 'naturales', label: '🌿 Naturales' },
        { id: 'cejas', label: '👁️ Cejas & Pestañas' }
    ];

    // Products / Services (usados tanto en el carrito de domicilios como en las citas)
    const products = [
        { id: 1, name: 'Manicure Clásico', category: 'unas', price: 45000, image: 'https://picsum.photos/300/300?random=10', description: 'Limpieza, corte, limado y esmaltado tradicional.' },
        { id: 2, name: 'Manicure Gelish', category: 'unas', price: 65000, image: 'https://picsum.photos/300/300?random=11', description: 'Esmaltado semipermanente de larga duración.' },
        { id: 3, name: 'Uñas Acrílicas', category: 'unas', price: 95000, image: 'https://picsum.photos/300/300?random=12', description: 'Diseño y aplicación de uñas acrílicas personalizadas.' },
        { id: 4, name: 'Pedicure Spa', category: 'unas', price: 55000, image: 'https://picsum.photos/300/300?random=13', description: 'Pedicure completo con exfoliación e hidratación.' },
        { id: 5, name: 'Extensiones Cabello Humano 40cm', category: 'extensiones', price: 180000, image: 'https://picsum.photos/300/300?random=14', description: 'Extensiones de cabello 100% humano, largas y sedosas.' },
        { id: 6, name: 'Extensiones Cabello Humano 60cm', category: 'extensiones', price: 250000, image: 'https://picsum.photos/300/300?random=15', description: 'Extensiones de cabello humano extra largas.' },
        { id: 7, name: 'Aceite de Coco Orgánico', category: 'naturales', price: 28000, image: 'https://picsum.photos/300/300?random=16', description: 'Aceite de coco puro para cabello y piel.' },
        { id: 8, name: 'Mascarilla Capilar Natural', category: 'naturales', price: 35000, image: 'https://picsum.photos/300/300?random=17', description: 'Mascarilla a base de ingredientes naturales.' },
        { id: 9, name: 'Diseño de Cejas', category: 'cejas', price: 25000, image: 'https://picsum.photos/300/300?random=18', description: 'Perfilado y diseño de cejas según tu rostro.' },
        { id: 10, name: 'Laminado de Cejas', category: 'cejas', price: 45000, image: 'https://picsum.photos/300/300?random=19', description: 'Laminado que realza y fija tus cejas por semanas.' },
        { id: 11, name: 'Pestañas Punto a Punto', category: 'cejas', price: 70000, image: 'https://picsum.photos/300/300?random=20', description: 'Extensiones de pestañas pelo a pelo, look natural.' },
        { id: 12, name: 'Kit Natural Capilar', category: 'naturales', price: 55000, image: 'https://picsum.photos/300/300?random=21', description: 'Kit completo: shampoo, acondicionador y mascarilla natural.' }
    ];

    // ===== RENDER FUNCTIONS =====

    function renderNav(items) {
        return items.map(i =>
            `<li><a href="${sanitize(i.href)}" class="text-gray-600 hover:text-purple-700 font-medium transition text-sm">${sanitize(i.label)}</a></li>`
        ).join('');
    }

    function renderMobileNav(items) {
        return items.map(i =>
            `<li><a href="${sanitize(i.href)}" class="block py-2 text-gray-700 hover:text-purple-700 font-medium transition">${sanitize(i.label)}</a></li>`
        ).join('');
    }

    function renderSocial(items) {
        return items.map(s =>
            `<a href="${sanitize(s.url)}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 ${s.color} transition hover:bg-gray-200" aria-label="${sanitize(s.label)}">
                <i class="${s.icon}"></i>
            </a>`
        ).join('');
    }

    function renderProducts(items) {
        if (!items.length) {
            return '<div class="col-span-full text-center py-12 text-gray-400"><i class="fas fa-box-open text-4xl mb-3 block"></i>No encontramos productos en esta categoría.</div>';
        }
        return items.map(p =>
            `<article class="bg-white rounded-2xl shadow-sm border border-gray-100 card-hover overflow-hidden flex flex-col">
                <div class="relative overflow-hidden">
                    <img src="${sanitize(p.image)}" alt="${sanitize(p.name)} - C.E.A Versátil" loading="lazy" class="w-full h-52 object-cover transition duration-500 hover:scale-105">
                    <span class="absolute top-3 left-3 badge">${sanitize(categories.find(c => c.id === p.category)?.label || p.category)}</span>
                </div>
                <div class="p-5 flex flex-col flex-1">
                    <h3 class="font-semibold text-gray-900 text-lg mb-1">${sanitize(p.name)}</h3>
                    <p class="text-sm text-gray-400 mb-3 flex-1">${sanitize(p.description)}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xl font-bold gradient-text">$${p.price.toLocaleString('es-CO')}</span>
                        <button class="add-to-cart-btn w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center hover:shadow-lg transition transform hover:scale-110" data-id="${p.id}" aria-label="Agregar ${sanitize(p.name)} al carrito">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </article>`
        ).join('');
    }

    function renderFilterButtons(items, active) {
        return items.map(c =>
            `<button class="filter-btn px-5 py-2 rounded-full text-sm font-medium transition border ${c.id === active ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700'}" data-category="${sanitize(c.id)}">${sanitize(c.label)}</button>`
        ).join('');
    }

    function renderFooterLinks(items) {
        return items.map(i =>
            `<li><a href="${sanitize(i.href)}" class="text-sm text-gray-400 hover:text-white transition">${sanitize(i.label)}</a></li>`
        ).join('');
    }

    function renderCartItems(items) {
        if (!items.length) {
            return `<div class="text-center py-12 text-gray-400"><i class="fas fa-shopping-bag text-4xl mb-3 block"></i>Tu carrito está vacío</div>`;
        }
        return items.map(item => {
            const p = products.find(pr => pr.id === item.id);
            if (!p) return '';
            return `<div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl cart-item" data-id="${p.id}">
                <img src="${sanitize(p.image)}" alt="${sanitize(p.name)}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 text-sm truncate">${sanitize(p.name)}</p>
                    <p class="text-sm text-gray-500">$${p.price.toLocaleString('es-CO')} x ${item.qty}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button class="cart-qty-btn w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition" data-id="${p.id}" data-action="decr">−</button>
                    <span class="text-sm font-semibold w-5 text-center">${item.qty}</span>
                    <button class="cart-qty-btn w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition" data-id="${p.id}" data-action="incr">+</button>
                </div>
                <button class="cart-remove-btn text-gray-400 hover:text-red-500 transition text-sm p-1" data-id="${p.id}" aria-label="Eliminar ${sanitize(p.name)}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>`;
        }).join('');
    }

    // ===== STATE =====
    let cart = []; // { id, qty }
    let currentCategory = 'todas';

    // ===== MOUNT: NAV / SOCIAL / FOOTER =====
    const desktopNavEl = document.getElementById('desktopNavList');
    if (desktopNavEl) desktopNavEl.innerHTML = renderNav(navItems);

    const mobileNavEl = document.getElementById('mobileNavList');
    if (mobileNavEl) mobileNavEl.innerHTML = renderMobileNav(navItems);

    const heroSocial = document.getElementById('heroSocial');
    if (heroSocial) heroSocial.innerHTML = renderSocial(socialLinks);
    const footerSocial = document.getElementById('footerSocial');
    if (footerSocial) footerSocial.innerHTML = renderSocial(socialLinks);

    const footerLinksEl = document.getElementById('footerLinks');
    if (footerLinksEl) footerLinksEl.innerHTML = renderFooterLinks(navItems);

    // ===== MOUNT: FILTROS Y PRODUCTOS =====
    const filterContainer = document.getElementById('filterButtons');
    if (filterContainer) filterContainer.innerHTML = renderFilterButtons(categories, currentCategory);

    function renderProductGrid(category) {
        const grid = document.getElementById('productGrid');
        if (!grid) return;
        const filtered = category === 'todas' ? products : products.filter(p => p.category === category);
        grid.innerHTML = renderProducts(filtered);
    }
    renderProductGrid(currentCategory);

    // ===== CARRITO DE DOMICILIOS =====
    function updateCartUI() {
        const badge = document.getElementById('cartBadge');
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (badge) {
            if (totalItems > 0) {
                badge.classList.remove('hidden');
                badge.textContent = totalItems > 99 ? '99+' : totalItems;
            } else {
                badge.classList.add('hidden');
            }
        }
        const cartItemsEl = document.getElementById('cartItems');
        if (cartItemsEl) cartItemsEl.innerHTML = renderCartItems(cart);
        const totalEl = document.getElementById('cartTotal');
        if (totalEl) {
            const total = cart.reduce((sum, item) => {
                const p = products.find(pr => pr.id === item.id);
                return sum + (p ? p.price * item.qty : 0);
            }, 0);
            totalEl.textContent = '$' + total.toLocaleString('es-CO');
        }
    }

    function addToCart(id) {
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, qty: 1 });
        }
        updateCartUI();
        const p = products.find(pr => pr.id === id);
        showToast(`${p ? p.name : 'Producto'} agregado al carrito`, 'fas fa-check-circle');
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
        showToast('Producto eliminado del carrito', 'fas fa-trash-alt');
    }

    function changeQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
        updateCartUI();
    }

    // ===== TOAST =====
    let toastTimeout;
    function showToast(message, icon = 'fas fa-check-circle') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        clearTimeout(toastTimeout);
        toast.innerHTML = `<i class="${icon}"></i> ${sanitize(message)}`;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ===== HORARIO DE ATENCIÓN (9:00 AM - 9:00 PM) =====
    function pad2(n) { return String(n).padStart(2, '0'); }

    function isBusinessOpenNow() {
        const now = new Date();
        const h = now.getHours();
        return h >= BUSINESS_OPEN_HOUR && h < BUSINESS_CLOSE_HOUR;
    }

    function updateOpenStatus() {
        const textEl = document.getElementById('openStatusText');
        const dotEl = document.getElementById('openStatusDot');
        if (!textEl) return;
        const open = isBusinessOpenNow();
        textEl.textContent = open
            ? 'Abierto ahora · 9:00 AM - 9:00 PM'
            : 'Cerrado ahora · Abrimos 9:00 AM';
        if (dotEl) {
            dotEl.classList.toggle('bg-green-500', open);
            dotEl.classList.toggle('bg-red-400', !open);
        }
    }

    // ===== CITAS: EVITAR CHOQUES DE HORARIO =====
    const APPOINTMENTS_KEY = 'cea_appointments';

    function getAppointments() {
        try {
            const raw = localStorage.getItem(APPOINTMENTS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveAppointments(list) {
        try {
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
        } catch (e) {
            // almacenamiento no disponible; la cita igual se confirma por WhatsApp
        }
    }

    function todayISO() {
        const d = new Date();
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    }

    // Genera las franjas horarias del día: 09:00, 09:30 ... 20:30 (última franja antes de las 9:00 PM)
    function generateTimeSlots() {
        const slots = [];
        for (let h = BUSINESS_OPEN_HOUR; h < BUSINESS_CLOSE_HOUR; h++) {
            for (let m = 0; m < 60; m += SLOT_MINUTES) {
                slots.push(`${pad2(h)}:${pad2(m)}`);
            }
        }
        return slots;
    }

    function isPastSlot(dateStr, timeStr) {
        const slotDate = new Date(`${dateStr}T${timeStr}:00`);
        return slotDate.getTime() < Date.now();
    }

    function isWithinBusinessHours(timeStr) {
        const [h] = timeStr.split(':').map(Number);
        return h >= BUSINESS_OPEN_HOUR && h < BUSINESS_CLOSE_HOUR;
    }

    function formatTimeLabel(t) {
        const [hStr, m] = t.split(':');
        let h = parseInt(hStr, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        return `${h12}:${m} ${ampm}`;
    }

    function populateServiceOptions() {
        const el = document.getElementById('apptService');
        if (!el) return;
        el.innerHTML = '<option value="">Elige un servicio</option>' +
            products.map(p => `<option value="${p.id}">${sanitize(p.name)} — $${p.price.toLocaleString('es-CO')}</option>`).join('');
    }

    // Rellena el select de horas según la fecha elegida, quitando las horas ya ocupadas y las que ya pasaron
    function populateTimeOptions() {
        const dateInput = document.getElementById('apptDate');
        const timeSelect = document.getElementById('apptTime');
        if (!dateInput || !timeSelect) return;

        const dateVal = dateInput.value;
        if (!dateVal) {
            timeSelect.innerHTML = '<option value="">Selecciona una fecha primero</option>';
            return;
        }

        const bookedTimes = getAppointments()
            .filter(a => a.date === dateVal)
            .map(a => a.time);

        const available = generateTimeSlots().filter(t =>
            !bookedTimes.includes(t) && !isPastSlot(dateVal, t)
        );

        if (!available.length) {
            timeSelect.innerHTML = '<option value="">No hay horarios disponibles este día</option>';
            return;
        }

        timeSelect.innerHTML = '<option value="">Elige una hora</option>' +
            available.map(t => `<option value="${t}">${formatTimeLabel(t)}</option>`).join('');
    }

    function showApptMsg(text, ok) {
        const msgEl = document.getElementById('apptMsg');
        if (!msgEl) return;
        msgEl.textContent = text;
        msgEl.className = 'text-sm ' + (ok ? 'text-green-600' : 'text-red-500');
        msgEl.classList.remove('hidden');
    }

    function initAppointments() {
        populateServiceOptions();

        const dateInput = document.getElementById('apptDate');
        if (dateInput) {
            const min = todayISO();
            dateInput.min = min;
            dateInput.value = min;
            dateInput.addEventListener('change', populateTimeOptions);
        }
        populateTimeOptions();

        const form = document.getElementById('appointmentForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('apptName').value.trim();
            const phone = document.getElementById('apptPhone').value.trim();
            const serviceId = parseInt(document.getElementById('apptService').value, 10);
            const date = document.getElementById('apptDate').value;
            const time = document.getElementById('apptTime').value;

            if (!name || !phone || !serviceId || !date || !time) {
                showApptMsg('Por favor completa todos los campos.', false);
                return;
            }

            // Validar dentro del horario de atención 9:00 AM - 9:00 PM
            if (!isWithinBusinessHours(time)) {
                showApptMsg('Ese horario está fuera de nuestra atención (9:00 AM - 9:00 PM). Estamos cerrados.', false);
                populateTimeOptions();
                return;
            }

            // No permitir horas pasadas
            if (isPastSlot(date, time)) {
                showApptMsg('Ese horario ya pasó. Por favor elige otro.', false);
                populateTimeOptions();
                return;
            }

            // Revalidar disponibilidad para evitar choques de citas (doble reserva)
            const currentAppointments = getAppointments();
            const clash = currentAppointments.some(a => a.date === date && a.time === time);
            if (clash) {
                showApptMsg('Lo sentimos, ese horario acaba de ser reservado por otra persona. Elige otro.', false);
                populateTimeOptions();
                return;
            }

            const service = products.find(p => p.id === serviceId);

            // Guardar la cita para bloquear ese horario y que no choque con otras
            currentAppointments.push({
                id: Date.now(),
                date,
                time,
                serviceId,
                serviceName: service ? service.name : '',
                name,
                phone
            });
            saveAppointments(currentAppointments);

            const fechaLegible = new Date(`${date}T${time}:00`).toLocaleDateString('es-CO', {
                weekday: 'long', day: 'numeric', month: 'long'
            });

            const waMsg =
                `¡Hola! Quiero confirmar mi cita 💇✨%0A%0A` +
                `👤 Nombre: ${name}%0A` +
                `💅 Servicio: ${service ? service.name : ''}%0A` +
                `📅 Fecha: ${fechaLegible}%0A` +
                `🕐 Hora: ${formatTimeLabel(time)}%0A` +
                `📞 Tel: ${phone}%0A%0A` +
                `📍 Calle 73 con Cra 26i - Cali`;

            window.open(`https://wa.me/573173933141?text=${waMsg}`, '_blank', 'noopener');

            showApptMsg('¡Cita agendada con éxito! Te esperamos 💜', true);
            form.reset();
            if (dateInput) dateInput.value = todayISO();
            populateTimeOptions();
        });
    }

    // ===== EVENT DELEGATION (click) =====
    document.addEventListener('click', function(e) {
        // --- Smooth scroll for anchor links ---
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                closeMobileNav();
            }
            return;
        }

        // --- Add to cart ---
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            e.preventDefault();
            const id = parseInt(addBtn.dataset.id, 10);
            if (id) addToCart(id);
            return;
        }

        // --- Filter buttons ---
        const filterBtn = e.target.closest('.filter-btn');
        if (filterBtn) {
            e.preventDefault();
            const cat = filterBtn.dataset.category;
            if (cat) {
                currentCategory = cat;
                if (filterContainer) filterContainer.innerHTML = renderFilterButtons(categories, currentCategory);
                renderProductGrid(currentCategory);
            }
            return;
        }

        // --- Cart qty buttons ---
        const qtyBtn = e.target.closest('.cart-qty-btn');
        if (qtyBtn) {
            e.preventDefault();
            const id = parseInt(qtyBtn.dataset.id, 10);
            const action = qtyBtn.dataset.action;
            if (id && action) {
                changeQty(id, action === 'incr' ? 1 : -1);
            }
            return;
        }

        // --- Cart remove ---
        const removeBtn = e.target.closest('.cart-remove-btn');
        if (removeBtn) {
            e.preventDefault();
            const id = parseInt(removeBtn.dataset.id, 10);
            if (id) removeFromCart(id);
            return;
        }

        // --- Cart toggle ---
        if (e.target.closest('#cartToggleBtn')) {
            e.preventDefault();
            toggleCart();
            return;
        }

        // --- Close cart overlay ---
        if (e.target.closest('#cartOverlay')) {
            closeCart();
            return;
        }

        // --- Menu toggle ---
        if (e.target.closest('#menuToggleBtn')) {
            e.preventDefault();
            toggleMobileNav();
            return;
        }

        // --- Close mobile overlay ---
        if (e.target.closest('#mobileOverlay')) {
            closeMobileNav();
            return;
        }

        // --- Close mobile from close button ---
        if (e.target.closest('#closeMobileBtn')) {
            e.preventDefault();
            closeMobileNav();
            return;
        }

        // --- Close cart from close button ---
        if (e.target.closest('#closeCartBtn')) {
            e.preventDefault();
            closeCart();
            return;
        }

        // --- Checkout / Pedido a domicilio ---
        const checkoutBtn = e.target.closest('#checkoutBtn');
        if (checkoutBtn) {
            e.preventDefault();
            if (cart.length === 0) {
                showToast('Tu carrito está vacío', 'fas fa-exclamation-circle');
                return;
            }

            const nameEl = document.getElementById('cartName');
            const phoneEl = document.getElementById('cartPhone');
            const neighborhoodEl = document.getElementById('cartNeighborhood');
            const addressEl = document.getElementById('cartAddress');

            const custName = nameEl ? nameEl.value.trim() : '';
            const custPhone = phoneEl ? phoneEl.value.trim() : '';
            const neighborhood = neighborhoodEl ? neighborhoodEl.value.trim() : '';
            const address = addressEl ? addressEl.value.trim() : '';

            if (!custName) {
                showToast('Por favor ingresa tu nombre', 'fas fa-exclamation-circle');
                if (nameEl) nameEl.focus();
                return;
            }
            if (!custPhone) {
                showToast('Por favor ingresa tu teléfono', 'fas fa-exclamation-circle');
                if (phoneEl) phoneEl.focus();
                return;
            }
            if (!neighborhood) {
                showToast('Por favor ingresa tu barrio', 'fas fa-exclamation-circle');
                if (neighborhoodEl) neighborhoodEl.focus();
                return;
            }
            if (!address) {
                showToast('Por favor ingresa tu dirección de domicilio', 'fas fa-exclamation-circle');
                if (addressEl) addressEl.focus();
                return;
            }

            const total = cart.reduce((sum, item) => {
                const p = products.find(pr => pr.id === item.id);
                return sum + (p ? p.price * item.qty : 0);
            }, 0);

            const itemsMsg = cart.map(item => {
                const p = products.find(pr => pr.id === item.id);
                return p ? `• ${p.name} x${item.qty} = $${(p.price * item.qty).toLocaleString('es-CO')}` : '';
            }).join('%0A');

            const fullMsg =
                `¡Hola! Quiero hacer un pedido a domicilio 🛍️:%0A%0A` +
                `${itemsMsg}%0A%0A` +
                `Total: $${total.toLocaleString('es-CO')}%0A%0A` +
                `👤 Nombre: ${custName}%0A` +
                `📞 Teléfono: ${custPhone}%0A` +
                `🏘️ Barrio: ${neighborhood}%0A` +
                `🏠 Dirección: ${address}%0A` +
                `📍 Salón: Calle 73 con Cra 26i - Cali%0A` +
                `💳 ¿Cómo puedo pagar?`;

            window.open(`https://wa.me/573173933141?text=${fullMsg}`, '_blank', 'noopener');
            showToast('Redirigiendo a WhatsApp...', 'fab fa-whatsapp');

            // Limpiar formulario de entrega tras el pedido
            if (nameEl) nameEl.value = '';
            if (phoneEl) phoneEl.value = '';
            if (neighborhoodEl) neighborhoodEl.value = '';
            if (addressEl) addressEl.value = '';
        }
    });

    // ===== MOBILE NAV =====
    function toggleMobileNav() {
        const nav = document.getElementById('mobileNav');
        const overlay = document.getElementById('mobileOverlay');
        if (!nav || !overlay) return;
        nav.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    }
    function closeMobileNav() {
        const nav = document.getElementById('mobileNav');
        const overlay = document.getElementById('mobileOverlay');
        if (!nav || !overlay) return;
        nav.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ===== CART =====
    function toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }
    function closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ===== INTERSECTION OBSERVER FOR FADE-IN =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // ===== SANITIZE ALL INPUTS (security) =====
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, textarea')) {
            e.target.value = e.target.value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
        }
    });

    // ===== INIT =====
    updateCartUI();
    updateOpenStatus();
    setInterval(updateOpenStatus, 60000); // refresca el estado abierto/cerrado cada minuto
    initAppointments();

    // Handle keyboard: Escape to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileNav();
            closeCart();
        }
    });

    console.log('🛡️ C.E.A Versátil — Conexión segura activa');
    console.log('🔒 Content Security Policy habilitada');
    console.log('🧹 Sanitización de inputs activa');
    console.log('📦 Modo e-commerce (domicilios) listo');
    console.log('📅 Sistema de citas activo · Horario 9:00 AM - 9:00 PM');
})();