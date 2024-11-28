//Authentication
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('loginPassword').value;

    const answer = await fetch('/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringfy({ email, password})

    });

    if (answer.ok) {
        alert('Successful signin');
        document.getElementById('authentication').style.display = 'none';
        document.getElementById('contentUploaded').style.display = 'block';
    }else {
        alert('Error');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    

    const answer = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringfy({username, email, password})
        

    });

    if(answer.ok) {
        alert('Registered successfully')
    }else{
        alert('Registeration failed')

    }

});

//Fetching content
async function fetchingPosts() {
    const answer = await fetch('/onlinePosts');
    const onlinePosts = await answer.json();
    const onlinePostList = document.getElementById('onlinePosts');

    onlinePostList.innerHTML = onlinePosts.map(onlinePost ` =>
    <li>
        <h4>${onlinePost.title}</h4>
        <p>${onlinePost.about}</p>
        ${onlinePost.photoUrl ? `<img src="${onlinePost.photoUrl}" alt="Image" width="200">` :''}
    </li>
    `).join('');
}

fetchingPosts();