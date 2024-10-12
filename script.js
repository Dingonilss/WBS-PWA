// © by Nils Ringelmann 2024

const urlToCheck = "http://wbs.local:5000/local" // Die URL, die überprüft werden soll

const verbindenButton = document.getElementById('verbindenButton')
const statusText = document.getElementById('statusText')
const loadingDiv = document.getElementById('loadingDiv')
const wbsIframe = document.getElementById('wbsIframe')
const manuellesSuchfeld = document.getElementById('manuellesSuchfeld')

var automatischeSucheAbbrechen = false
var serverGefunden = false



document.addEventListener('DOMContentLoaded', () => {

    // ----------------------- Service Worker Registrieren -----------------------
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Hallo'))
            .catch((error) => console.warn(error))
    }
    // ----------------------- Service Worker Registrieren -----------------------

    animierterSuchText()
    
    if (window.location.href.includes('https://') && !confirm('Die aktuelle Seite ist HTTPS vershlüsselt, daher ist eine automatische Serversuche möglich. Dennoch versuchen?')) {
        /* continue regardless of error */
    } else {
        updateServerSuche()
    }
})



// ----------------------- Automatische Suche -----------------------

function updateServerSuche() {
    if (automatischeSucheAbbrechen == true) { return }
    try { checkWebsiteAndRedirect() }
    catch { /* continue regardless of error */ }
    setTimeout(updateServerSuche, 5000)
}


function serverIstGefunden() {
    console.log('Server gefunden.')
    verbindenButton.classList.add('serverGefunden')
    loadingDiv.style.display = 'none'
    serverGefunden = true
    statusText.innerHTML = 'Server gefunden.'
}


function serverIstNichtGefunden() {
    console.log('Server nicht gefunden.')
    verbindenButton.classList.remove('serverGefunden')
    loadingDiv.style.display = 'flex'
    if (serverGefunden) {
        serverGefunden = false
        animierterSuchText()
    }
}


async function checkWebsiteAndRedirect() {
    console.log(`suche ${urlToCheck} ...`)
    try {
        const response = await fetch(urlToCheck, { mode: 'no-cors' });
        if (response.ok || response.type === 'opaque') {
            serverIstGefunden()
        } else {
            console.log("Website nicht erreichbar:", response.status);
            serverIstNichtGefunden()
        }
    } catch (error) {
        console.log("Fehler beim Erreichen der Website:", error);
        serverIstNichtGefunden()
    }
    return
}


function animierterSuchText() {
    const animationSpeed = 500//ms
    function status1() {
        if (serverGefunden) { return }
        statusText.innerHTML = 'suche Server'
        setTimeout(status2, animationSpeed)
    }
    function status2() {
        if (serverGefunden) { return }
        statusText.innerHTML = 'suche Server.'
        setTimeout(status3, animationSpeed)
    }
    function status3() {
        if (serverGefunden) { return }
        statusText.innerHTML = 'suche Server..'
        setTimeout(status4, animationSpeed)
    }
    function status4() {
        if (serverGefunden) { return }
        statusText.innerHTML = 'suche Server...'
        setTimeout(status1, animationSpeed)
    }
    status1()
}


// ----------------------- Automatische Suche -----------------------

// ----------------------- Manuelle Suche -----------------------


function manuelleSuche() { // eslint-disable-line no-unused-vars
    let suchUrl = manuellesSuchfeld.value
    if (suchUrl == '') { return }
    // überprüfe ob versehentlich das verschlüsselte Protokoll HTTPS verwendet wurde.
    if (suchUrl.toLowerCase().includes('https')) {
        console.log('ÖI')
        if (!confirm('Das Standartprotokoll des WBS Service ist das unverschlüsselte HTTP Protokoll. Sie haben hier das verschlüsselte HTTPS Protokoll gewählt. Wollen Sie dennoch versuchen die Verbindung herzustellen?')) { return }
    }
    // schreibe noch das http dazu, wenn nicht vorhanden
    if (!suchUrl.toLowerCase().includes('://')) {
        suchUrl = `http://${suchUrl}`
    }
    // schreibe noch den standart Port dazu, wenn nicht vorhanden
    if (suchUrl.toLowerCase().split(':').length == 2) {
        suchUrl = `${suchUrl}:5000`
    }
    checkManuellWebsiteAndRedirect(suchUrl)
}


async function checkManuellWebsiteAndRedirect(url) {
    console.log(`suche ${url} ...`)
    try {
        const response = await fetch(url, { mode: 'no-cors' });
        if (response.ok || response.type === 'opaque') {
            verbindeMitServer(url)
        } else {
            console.log("Website nicht erreichbar:", response.status)
            if (confirm(`Der gesuchte Server "${url}" ist nicht erreichbar. Dennoch versuchen zu verbinden?`)) {
                verbindeMitServer(url)
            }
        }
    } catch (error) {
        console.log("Fehler beim Erreichen der Website:", error)
        if (confirm(`Der gesuchte Server "${url}" ist nicht erreichbar. Dennoch versuchen zu verbinden?`)) {
            verbindeMitServer(url)
        }
    }
    return
}


// ----------------------- Manuelle Suche -----------------------


function verbindeMitServer(adress = urlToCheck) { // eslint-disable-line no-unused-vars
    automatischeSucheAbbrechen = true
    //wbsIframe.src = adress
    //wbsIframe.style.display = 'block'
    //document.getElementsByTagName('main')[0].innerHTML = ''
    window.location.href = adress
}
