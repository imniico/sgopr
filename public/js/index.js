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

    if (username === "NicoM99") {
        const finalizartodos = document.getElementById("finalizar-todos");
        finalizartodos.style.display = "block";
    }

    const bienvenido = document.getElementById("bienvenida");
    bienvenido.innerText = `Bienvenido ${username}!`;

    socket.emit("new-user", username);
    
    
});

const calcpuntaje = document.getElementById("finalizar");

const valueOf = (array) => {
    for (let i = 0; i < array.length; i++) {if (array[i].checked) {return array[i].value;}}
}
const calcularPuntaje = () => {

    let p1value, p2value, p3value, p4value, p5value
    let p6value, p7value, p8value, p9value, p10value;

    const p1 = document.getElementsByName("p1");
    const p2 = document.getElementsByName("p2");
    const p3 = document.getElementById("p3");
    const p4 = document.getElementsByName("p4");
    const p5 = document.getElementsByName("p5");
    const p6 = document.getElementsByName("p6");
    const p7 = document.getElementsByName("p7");
    const p8 = document.getElementsByName("p8");
    const p9 = document.getElementsByName("p9");
    const p10 = document.getElementsByName("p10");

    p1value = valueOf(p1);
    p2value = valueOf(p2);
    p3value = p3.value;
    p4value = valueOf(p4);
    p5value = valueOf(p5);
    p6value = valueOf(p6);
    p7value = valueOf(p7);
    p8value = valueOf(p8);
    p9value = valueOf(p9);
    p10value = valueOf(p10);

    const respuestas = [ p1value, p2value, p3value, p4value, p5value,
                         p6value, p7value, p8value, p9value, p10value ]
 
    const correctos = [ 3, 1, 10000, 3, 2,
                        3, 2, 2, 3, 1 ];

    let puntaje = 0;

    for (let i = 0; i < respuestas.length; i++) {
        if (respuestas[i] == correctos[i]){
            puntaje += 15;
        }
    }

    return puntaje;
}
calcpuntaje.addEventListener("click", (e) => {
    const puntaje = calcularPuntaje();
    document.querySelector(".preguntas-container").style.display = "none";
    document.getElementById("finalizar").style.display = "none";
    socket.emit("finalizar", { username, puntaje: puntaje })
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




