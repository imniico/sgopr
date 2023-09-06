const socket = io();

let username;

Swal.fire({
    title: 'Ingresa un usuario',
    input: "text",
    inputValidator: (value) => {
        return !value && "Es obligatorio introducir un usuario";
    },
    allowOutsideClick: false
}).then((result) => {
    username = result.value;

    if (username === "adminsgo@") {
        const finalizartodos = document.getElementById("finalizar-todos");
        finalizartodos.style.display = "block";
    }

    const bienvenido = document.getElementById("bienvenida");
    bienvenido.innerText = `Bienvenido ${username}!`;

    socket.emit("new-user", username);
});

const calcpuntaje = document.getElementById("finalizar");
//CALCULAR para conseguir "puntaje";
calcpuntaje.addEventListener("click", (e) => {
    socket.emit("finalizar", { username, puntaje: 5 })
})

const finalizartodos = document.getElementById("finalizar-todos");
finalizartodos.addEventListener("click", (e) => {
    console.log("A")
    socket.emit("finalizar-todos", 1)
})

socket.on("puntuaciones", (usernames) => {

    const puntajes = usernames.map((u) => {
        return `<p> ${u.user} - ${u.puntaje} </p>`
    })

    const content = puntajes.join("");
    console.log(content)

    Swal.fire({
        title: `Puntuaciones`,
        html: content,
        toast: true,
        position: "top-end"
    });

})

const participantes = document.getElementById("participantes");
socket.on("participantes", (data) => {
    let users = "";
    data.forEach((p) => {
        users += `<br><b>${p.user}`;
    });
    participantes.innerHTML = users;
})

const puntaje = document.getElementById("puntaje-final");
socket.on("puntaje-final", (data) => {
    puntaje.innerText = `Tu puntaje final es: ${data}`;
})




