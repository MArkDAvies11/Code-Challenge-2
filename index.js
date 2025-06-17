document.addEventListener('DOMContentLoaded', () => {
    const guestNameInput = document.getElementById('guestNameInput');
    const addGuestButton = document.getElementById('addGuestButton');
    const guestListUl = document.getElementById('guestList');
    const currentGuestCountSpan = document.getElementById('currentGuestCount');

    let guests = []; 
    const MAX_GUESTS = 10;

    
    guestNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addGuestButton.click();
        }
    });

    function renderGuestList() {
        guestListUl.innerHTML = '';
        currentGuestCountSpan.textContent = guests.length; 

        if (guests.length >= MAX_GUESTS) {
            addGuestButton.disabled = true;
            guestNameInput.disabled = true;
            guestNameInput.placeholder = "List is full!";
            alert('Guest list has reached its limit of ' + MAX_GUESTS + ' people!');
        } else {
            addGuestButton.disabled = false;
            guestNameInput.disabled = false;
            guestNameInput.placeholder = "Enter guest's name";
        }

        guests.forEach((guest, index) => {
            const listItem = document.createElement('li');
            listItem.dataset.id = guest.id;
            if (guest.attending !== undefined) {
                if (guest.attending) {
                    listItem.classList.add('attending');
                } else {
                    listItem.classList.add('not-attending');
                }
            }
            const guestInfoDiv = document.createElement('div');
            guestInfoDiv.classList.add('guest-info');
            const guestNameSpan = document.createElement('span');
            guestNameSpan.classList.add('guest-name');
            guestNameSpan.textContent = guest.name;

            const guestMetaDiv = document.createElement('div');
            guestMetaDiv.classList.add('guest-meta');

            let metaText = [];

            
            if (guest.category) {
                const categorySpan = document.createElement('span');
                categorySpan.classList.add('guest-category', `category-${guest.category.toLowerCase()}`);
                categorySpan.textContent = guest.category;
                guestNameSpan.appendChild(categorySpan);
            }

            
            if (guest.addedTime) {
                metaText.push(`Added: ${new Date(guest.addedTime).toLocaleString()}`);
            }

            
            if (guest.attending !== undefined) {
                metaText.push(`Status: ${guest.attending ? 'Attending' : 'Not Attending'}`);
            }

            guestMetaDiv.textContent = metaText.join(' | ');

            guestInfoDiv.appendChild(guestNameSpan);
            guestInfoDiv.appendChild(guestMetaDiv);

            const guestActionsDiv = document.createElement('div');
            guestActionsDiv.classList.add('guest-actions');

            const toggleRsvpButton = document.createElement('button');
            toggleRsvpButton.classList.add('toggle-rsvp');
            toggleRsvpButton.textContent = guest.attending ? 'Mark Not Attending' : 'Mark Attending';
            toggleRsvpButton.addEventListener('click', () => toggleRsvp(guest.id));
            const editButton = document.createElement('button');
            editButton.classList.add('edit-guest');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editGuest(guest.id));

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeGuest(guest.id));

            guestActionsDiv.appendChild(toggleRsvpButton);
            guestActionsDiv.appendChild(editButton);
            guestActionsDiv.appendChild(removeButton);

            listItem.appendChild(guestInfoDiv);
            listItem.appendChild(guestActionsDiv);
            guestListUl.appendChild(listItem);
        });
    }

    
    addGuestButton.addEventListener('click', () => {
        const name = guestNameInput.value.trim();

        if (name === '') {
            alert('Please enter a guest name.');
            return;
        }

        if (guests.length >= MAX_GUESTS) {
            alert('Guest list has reached its limit of ' + MAX_GUESTS + ' people!');
            return;
        }

        
        const category = prompt('Enter guest category (Friend, Family, Colleague - optional):');
        const validCategories = ['friend', 'family', 'colleague'];
        let guestCategory = null;
        if (category && validCategories.includes(category.toLowerCase())) {
            guestCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(); 
        } else if (category) {
            alert('Invalid category. Please use Friend, Family, or Colleague.');
        }

        const newGuest = {
            id: Date.now(),
            name: name,
            attending: true, 
            addedTime: new Date().toISOString(),
            category: guestCategory 
        };

        guests.push(newGuest);
        guestNameInput.value = ''; 
        renderGuestList();
    });

    
    function removeGuest(id) {
        guests = guests.filter(guest => guest.id !== id);
        renderGuestList();
    }

    
    function toggleRsvp(id) {
        const guestIndex = guests.findIndex(guest => guest.id === id);
        if (guestIndex > -1) {
            guests[guestIndex].attending = !guests[guestIndex].attending;
            renderGuestList();
        }
    }

    
    function editGuest(id) {
        const guestIndex = guests.findIndex(guest => guest.id === id);
        if (guestIndex > -1) {
            const currentName = guests[guestIndex].name;
            const newName = prompt('Edit guest name:', currentName);
            if (newName !== null && newName.trim() !== '') {
                guests[guestIndex].name = newName.trim();
                renderGuestList();
            } else if (newName !== null) { 
                alert('Guest name cannot be empty.');
            }
        }
    }

    
    renderGuestList();
});