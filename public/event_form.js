// Function that fetch all events and display them on the webpage
function fetchEvents() {
    fetch('/events')
      .then(response => response.json())
      .then(events => {
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';
  
        events.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.innerHTML = `
            <h2>${event.name}</h2>
            <p>Tagline: ${event.tagline}</p>
            <p>Schedule: ${event.schedule}</p>
            <p>Description: ${event.description}</p>
            <p>Moderator: ${event.moderator}</p>
            <p>Category: ${event.category}</p>
            <p>Sub Category: ${event.sub_category}</p>
            <p>Rigor Rank: ${event.rigor_rank}</p>
            <p>Attendees: ${event.attendees}</p>
            <button onclick="editEvent(${event.id})">Edit</button>
            <button onclick="deleteEvent(${event.id})">Delete</button>
          `;
  
          eventList.appendChild(eventDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }
  
  // Function to handle the submission of form
  document.getElementById('eventForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
  
    fetch('/events', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        console.log('Event created successfully:', result);
        form.reset();
        fetchEvents();
      })
      .catch(error => {
        console.error('Error creating event:', error);
      });
  });
  
  // Function to edit an event
  function editEvent(eventId) {
    fetch(`/events/${eventId}`)
      .then(response => response.json())
      .then(event => {
        const form = document.getElementById('eventForm');
        const uidInput = document.getElementById('uid');
        const nameInput = document.getElementById('name');
        const taglineInput = document.getElementById('tagline');
        const scheduleInput = document.getElementById('schedule');
        const descriptionInput = document.getElementById('description');
        const moderatorInput = document.getElementById('moderator');
        const categoryInput = document.getElementById('category');
        const subCategoryInput = document.getElementById('sub_category');
        const rigorRankInput = document.getElementById('rigor_rank');
        const attendeesInput = document.getElementById('attendees');
  
        // Pre-fill the form inputs with the event data
        uidInput.value = event.uid;
        nameInput.value = event.name;
        taglineInput.value = event.tagline;
        scheduleInput.value = event.schedule;
        descriptionInput.value = event.description;
        moderatorInput.value = event.moderator;
        categoryInput.value = event.category;
        subCategoryInput.value = event.sub_category;
        rigorRankInput.value = event.rigor_rank;
        attendeesInput.value = event.attendees;
  
        // Update the form action to point to the correct endpoint for updating the event
        form.action = `/events/${eventId}`;
      })
      .catch(error => {
        console.error('Error fetching event:', error);
      });
  }
  
  // Function to delete an event
  function deleteEvent(eventId) {
    fetch(`/events/${eventId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(result => {
        console.log('Event deleted successfully:', result);
        fetchEvents();
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  }
  // Fetch and display events when the page loads
  fetchEvents();
 