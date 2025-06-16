document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.style.opacity = '1';
                eyeIcon.alt = 'Ocultar senha';
            } else {
                passwordInput.type = 'password';
                eyeIcon.style.opacity = '0.6';
                eyeIcon.alt = 'Mostrar senha';
            }
        });
    });

    // CPF formatting
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // Phone formatting
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });

    // Date formatting and validation
    const birthdateInput = document.getElementById('birthdate');
    const birthdateError = document.getElementById('birthdateError');

    // Format date input as user types
    birthdateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length >= 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        
        e.target.value = value;
        
        // Validate date if complete
        if (value.length === 10) {
            validateDateInput(value);
        } else {
            clearDateError();
        }
    });

    // Validate date input
    function validateDateInput(dateString) {
        const dateParts = dateString.split('/');
        if (dateParts.length !== 3) {
            showDateError('Formato de data inválido. Use dd/mm/aaaa');
            return false;
        }

        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const year = parseInt(dateParts[2]);

        // Basic validation
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2025) {
            showDateError('Data inválida');
            return false;
        }

        // Create date object and validate
        const date = new Date(year, month - 1, day);
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
            showDateError('Data inválida');
            return false;
        }

        // Validate age
        return validateAge(date);
    }

    function showDateError(message) {
        birthdateError.textContent = message;
        birthdateInput.style.borderColor = '#ff4444';
    }

    function clearDateError() {
        birthdateError.textContent = '';
        birthdateInput.style.borderColor = '#ddd';
    }

    // Calendar functionality
    const calendarButton = document.getElementById('calendarButton');
    const calendarPopup = document.getElementById('calendarPopup');
    const monthYearSpan = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedDate = null;

    const months = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    function validateAge(date) {
        const age = calculateAge(date);
        if (age < 18) {
            showDateError('Você deve ter pelo menos 18 anos para se cadastrar.');
            return false;
        } else {
            clearDateError();
            return true;
        }
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthYearSpan.textContent = `${months[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        calendarDays.innerHTML = '';
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();
            
            if (date.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            if (date.toDateString() === new Date().toDateString()) {
                dayElement.classList.add('today');
            }
            
            if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                dayElement.classList.add('selected');
            }
            
            dayElement.addEventListener('click', function() {
                if (!dayElement.classList.contains('other-month')) {
                    selectedDate = new Date(date);
                    birthdateInput.value = formatDate(selectedDate);
                    
                    // Validate age
                    validateAge(selectedDate);
                    
                    calendarPopup.classList.remove('show');
                    renderCalendar();
                }
            });
            
            calendarDays.appendChild(dayElement);
        }
    }

    calendarButton.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarPopup.classList.toggle('show');
        if (calendarPopup.classList.contains('show')) {
            renderCalendar();
        }
    });

    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Close calendar when clicking outside
    document.addEventListener('click', function(e) {
        if (!calendarPopup.contains(e.target) && e.target !== calendarButton) {
            calendarPopup.classList.remove('show');
        }
    });

    // Prevent calendar from closing when clicking inside
    calendarPopup.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Form submission
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Previna o comportamento padrão de envio do formulário (recarregar a página)
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const birthdate = document.getElementById('birthdate').value;
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return; 
        }

        if (birthdate) {
            if (!validateDateInput(birthdate)) { 
                alert('Por favor, insira uma data de nascimento válida e verifique a idade mínima.');
                return;
            }
        }
        
        alert('Cadastro realizado com sucesso! Redirecionando para a página de agendamento...');
        
        window.location.href = '../Agendamento/index.html'; 
    });

    // Back button
    document.querySelector('.btn-back').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja voltar? Os dados não salvos serão perdidos.')) {
            window.history.back();
        }
    });
});