window.onload = async function() {
    // Retrieve the user's name from sessionStorage
    const userName = sessionStorage.getItem('name');
    const userId = sessionStorage.getItem('id');
    const status = sessionStorage.getItem('status');
    // console.log(userId);
    
    // If the user's name is available
    if (userName) {
        try {
            // Send a request to the server to fetch user data based on the name
            // const response = null;
            // if(status == 2){
              
              const response = await fetch(`/api/groomersedit/${userId}`);
            // }else if(status == 3){

            // }
            
            const userData = await response.json();
            console.log(userData);
            
            // Populate the input fields with the user's data
            document.getElementById("description").value = userData.description;
            document.getElementById("scheduling").value = userData.scheduling;
            document.getElementById("price").value = userData.price;
            
           
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
  }