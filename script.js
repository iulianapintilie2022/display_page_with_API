
const USER_CARD_TEMPLATE = `
<div class="user">
    <img alt="user-photo" class="photo" src="{USER_PHOTO_URL}">
    <h2 class="name">{USER_NAME}</h2>
    <p class="email">Email:<span>{USER_EMAIL}</span></p>
    <p class="password">Password:<span>{USER_PASSWORD}</span></p>
    <p class="gender">Gender:<span>{USER_GENDER}</span></p>
    <p class="phone">Phone:<span>{USER_PHONE}</span></p>
    <p class="location">Location:<span>{USER_LOCATION}</span></p>
    <p class="birthday">Birthday:<span>{USER_BIRTHDAY}</span></p>
</div>`;

const userBuffer = [];

async function main(userBuffer) {
    loadUserBuffer(userBuffer);
    console.log(userBuffer);
    if (userBuffer.length) {
        insertSavedUsersHeader();
        for (let i = 0; i < userBuffer.length; i++) {
           if (document.getElementById("savedUsersContainer")) {
               document.getElementById("savedUsersContainer")
                   .appendChild(createUserCard(userBuffer[i], true));
           }
        } userBuffer = [];
    }
    await fetchAndAddUserToBody(userBuffer);
    bindGetUserEventHandler(document.getElementById("get-user-button"), userBuffer);
    bindSaveUserEventHandler(document.getElementById("save-users-button"), userBuffer);
}

async function fetchAndAddUserToBody(userBuffer) {
    const user = await getRandomUser();
    userBuffer.push(user);
    document.getElementById("container2").appendChild(createUserCard(user));
}

function bindGetUserEventHandler(button, userBuffer) {
    const onClick = ((userBuffer) => {
        return async () => {
            await fetchAndAddUserToBody(userBuffer);
        };
    })(userBuffer);
    button.addEventListener("click", onClick);
}

function insertSavedUsersHeader() {
    const header = document.createElement("h3");
    header.innerText = "Saved Users";
    document.body.appendChild(header);
    if(document.getElementById("container2")){
        document.getElementById("container2")
                .insertAdjacentElement("afterend", header);
    }

}

function bindSaveUserEventHandler(button, userBuffer) {
    const onClick = ((userBuffer) => {
        return () => {
            saveUserBuffer(userBuffer);
            insertSavedUsersHeader();
            userBuffer.map((user) => {
                document.getElementById("savedUsersContainer").appendChild(createUserCard(user, true));
            });
        };
    })(userBuffer);
    button.addEventListener("click", onClick);
}

function saveUserBuffer(userBuffer) {
    localStorage.setItem("userBuffer", JSON.stringify(userBuffer));
}

function loadUserBuffer(userBuffer) {
    const loadedUsers = JSON.parse(localStorage.getItem("userBuffer"));
    if (loadedUsers?.length) {
        for (let i = 0; i < loadedUsers.length; i++){
            userBuffer.push(loadedUsers[i]);
        }
    }
}

async function getRandomUser() {
    try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        const user =  data["results"][0];
        console.log("user:", user);
        return user;
    } catch (error) {
        console.error(error)
    }
}

function createUserCard(userData, isSaved) {
    const temp = document.createElement('div');
    let userCardHtml = USER_CARD_TEMPLATE.slice(1);
    console.log("userData :", userData);
    const templateData = [];
    templateData["USER_PHOTO_URL"] = userData.picture.large;
    templateData["USER_NAME"] = userData.name.first + " " + userData.name.last;
    templateData["USER_EMAIL"] = userData.email;
    templateData["USER_PASSWORD"] = userData.login.password;
    templateData["USER_GENDER"] = userData.gender;
    templateData["USER_PHONE"] = userData.cell;
    templateData["USER_LOCATION"] = `${userData.location.city} ${userData.location.country}`;
    const userBirthDate = new Date(userData.dob.date);
    templateData["USER_BIRTHDAY"] = `${userBirthDate.getDate()}/${userBirthDate.getMonth()}/${userBirthDate.getFullYear()}`;

    Object.keys(templateData).forEach((key) => {
        userCardHtml = userCardHtml.replace(`{${key}}`, templateData[key]);
    });

    temp.innerHTML = userCardHtml.trim();
    const userCard = temp.firstChild;
    temp.remove();

    if (isSaved) {
        userCard.classList.add("saved");
    }

    return userCard;
}


main(userBuffer);