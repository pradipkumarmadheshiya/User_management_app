const loadDataBtn=document.getElementById("loadDataBtn")
const userDataBox=document.getElementById("userDataBox")
const idInp=document.getElementById("idInp")
const nameInp=document.getElementById("nameInp")
const emailInp=document.getElementById("emailInp")
const saveBtn=document.getElementById("saveBtn")
const deleteBtn=document.getElementById("deleteBtn")

// fetch user data
const fetchUserDataFun=async ()=>{
    try{
        const res=await fetch("https://reqres.in/api/users")
        const data=await res.json()
        console.log(data)
        displayUserDataFun(data)
    }
    catch(error){
        console.log("Error is:", error)
    }
}
loadDataBtn.addEventListener("click", fetchUserDataFun)

// Display user data 
const displayUserDataFun=(data)=>{
    userDataBox.innerHTML=""
    data.data.forEach(item=>{
        const card=document.createElement("div")
        card.classList.add("card")
        card.setAttribute("userId", item.id)
        const image=document.createElement("img")
        image.src=item.avatar
        const name=document.createElement("p")
        name.textContent=`${item.first_name} ${item.last_name}`
        const email=document.createElement("p")
        email.textContent=item.email
        const edit=document.createElement("a")
        edit.href="#userForm"
        edit.textContent="EDIT"
        edit.addEventListener("click", ()=>populateFormFun(item.id, `${item.first_name} ${item.last_name}` ,item.email))

        card.append(image, name, email, edit)
        userDataBox.appendChild(card)
    })
}

// Edit the data
const populateFormFun=(userId, name, email)=>{
    idInp.value=userId
    nameInp.value=name
    emailInp.value=email
}

// save data (add new or edit)
const saveUserFun=(event)=>{
    event.preventDefault()
    const userIdVal=idInp.value.trim()
    const nameInpVal=nameInp.value.trim()
    const emailInpVal=emailInp.value.trim()

    if (userIdVal){
        fetch(`https://reqres.in/api/users/${userIdVal}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nameInpVal, email: emailInpVal })
          })
            .then((res) => res.json())
            .then((data) => {
              alert("Updated successfully");
              fetchUserDataFun();
              clearForm();
            });
    }

    else if (nameInpVal!=="" && emailInpVal!==""){
        fetch("https://reqres.in/api/users", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({name:nameInpVal, email:emailInpVal})
        })
        .then(res=>res.json())
        .then(()=>{
            alert("Data added successfully")
            fetchUserDataFun()
        })
    }
    else{
        alert("Please fill name and email both")
    }
}
saveBtn.addEventListener("click", saveUserFun)

// delete user data
const deleteDataFun=(event)=>{
    event.preventDefault()
    const userIdVal=idInp.value
    if (userIdVal){
        fetch(`https://reqres.in/api/users/${userIdVal}`, {
            method:"DELETE",
        })
        .then(()=>{
            alert("User deleted successfully")
            fetchUserDataFun()
            clearForm()
        })
    }
    else{
        alert("Please select user")
        fetchUserDataFun()
    }
}
deleteBtn.addEventListener("click", deleteDataFun)

function clearForm(){
    idInp.value=""
    nameInp.value=""
    emailInp.value=""
}