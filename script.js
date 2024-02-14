
// Met en forme le nom de l'agent pour le lien
function format_agent(nom) {
    var lien_agent = nom.toLowerCase();
    lien_agent = lien_agent.replace(/ /g, '-');
    lien_agent = lien_agent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return lien_agent;
}

// Récupère le numéro de téléphone
function get_phone() {
    var numero = document.getElementById("numero").value;
    numero = numero.replace(/\s/g, '');
    numero = numero.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    return numero;
}

// Récupère la photo
function get_photo() {
    var imageInput = document.getElementById('imageInput');
    var image1 = new Image();
    console.log(imageInput.files[0])
    console.log(imageInput)
    image1.src = URL.createObjectURL(imageInput.files[0]);
    return image1.src;
}

// Génère le QRCode
function get_QRCode(lien_agent) {
    const CodeQR = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "png",
        data: `https://liberkeys.com/agents/${lien_agent}`,
        image: "https://uploads-ssl.webflow.com/6022985415e9f66f2904c07b/65ccaff32f54e9dbba3a4dd4_lk.png",
        dotsOptions: {
            color: "#241C1A",
            type: ""
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: -60
        }
    });
    return CodeQR;
}

// Récupère le métier
function get_metier() {
    var metier = document.querySelector('input[name="metier"]:checked').value;
    return metier;
}

// Dessine une image
function draw_Image(source, page, axeX, axeY, hauteur, largeur) {
    page.drawImage(source, {
        x: axeX,
        y: axeY,
        width: largeur,
        height: hauteur
    })
}

// Dessine du texte
function draw_Text(source, page, axeX, axeY, taille, police, couleur) {
    page.drawText(source, {
        x: axeX,
        y: axeY,
        size: taille,
        font: police,
        color: couleur
    })
}

// Fonctions d'exécution
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

var beige = rgb(0.99, 0.95, 0.93);
var marron = rgb(0.14, 0.11, 0.10);
var orange = rgb(0.93, 0.58, 0.45);
var rouge = rgb(1, 0, 0);
var ppsansregu = 'https://cdn.jsdelivr.net/gh/theoliberkeys/assets-agents/ppsansregu.otf';
var ppsansextra = 'https://cdn.jsdelivr.net/gh/theoliberkeys/assets-agents/ppsansextra.otf';

// Panneau simple
async function panneau_simple(nom, numero, fichier, photo) {

    // Récupère le fichier
    const url = fichier;
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Récupère les polices
    var lienfont = ppsansextra
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppextra = await pdfDoc.embedFont(fontBytes)

    var lienfont = ppsansregu
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppregu = await pdfDoc.embedFont(fontBytes)

    // Récupère les pages
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    // Récupère l'excedent de caractères
    var excedent = (nom.length - 11);
    excedent = (excedent < 0) ? 0 : excedent;

    // Place le nom et le numéro
    draw_Text(nom, firstPage, (630 - (excedent * 20)), 185, (145 - excedent), ppregu, orange)
    draw_Text(numero, firstPage, 160, 400, 200, ppextra, marron)

    // Récupère l'image
    const lienimage = photo;
    const pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.5)

    // Place l'image
    draw_Image(pngImage, firstPage, (250 - (excedent * 16)), 60, (pngDims.width - (excedent * 2)), (pngDims.height - (excedent * 2)))

    const pdfBytes = await pdfDoc.save()

    // Enregistre le fichier
    var filename = fichier.includes("vendu") ? 'VENDU' : 'AV';
    download(pdfBytes, `PANNEAU_SIMPLE_${filename}.pdf`, "application/pdf");
}

async function panneau_double(nom, numero, fichier, photo) {

    // Récupère le fichier
    const url = fichier;
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Récupère les polices
    var lienfont = ppsansextra
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppextra = await pdfDoc.embedFont(fontBytes)

    var lienfont = ppsansregu
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppregu = await pdfDoc.embedFont(fontBytes)

    // Récupère les pages
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    var excedent = (nom.length - 11);
    excedent = (excedent < 0) ? 0 : excedent;

    // Place le nom et le numéro
    draw_Text(nom, firstPage, (505 - (excedent * 7)), 240, (130 - (excedent * 2)), ppregu, orange)
    draw_Text(nom, firstPage, (2205 - (excedent * 7)), 240, (130 - (excedent * 2)), ppregu, orange)

    draw_Text(numero, firstPage, 165, 467, 164, ppextra, marron)
    draw_Text(numero, firstPage, 1865, 467, 164, ppextra, marron)

    // Récupère l'image
    const lienimage = photo;
    const pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.475)

    // Place l'image
    draw_Image(pngImage, firstPage, (170 - (excedent * 7)), 85, pngDims.width, pngDims.height)
    draw_Image(pngImage, firstPage, (1870 - (excedent * 7)), 85, pngDims.width, pngDims.height)

    const pdfBytes = await pdfDoc.save()

    // Enregistre le fichier
    var filename = fichier.includes("vendu") ? 'VENDU' : 'AV';
    download(pdfBytes, `PANNEAU_DOUBLE_${filename}.pdf`, "application/pdf");
}

async function carte_de_visite(nom, mail, metier, numero, fichier, photo) {
    // Récupère le fichier
    const url = fichier;
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Récupère les polices
    var lienfont = ppsansextra
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppextra = await pdfDoc.embedFont(fontBytes)

    var lienfont = ppsansregu
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppregu = await pdfDoc.embedFont(fontBytes)

    // Récupère les pages
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    var excedent = (nom.length - 11);
    excedent = (excedent < 0) ? 0 : excedent;

    // Place le nom, le métier, le numéro et le mail
    draw_Text(nom, firstPage, 15, 136, 10, ppextra, orange)
    draw_Text(metier, firstPage, 15, 118, 10, ppregu, beige)
    draw_Text(numero, firstPage, 15, 100, 8, ppregu, beige)
    draw_Text(mail, firstPage, 15, 82, 8, ppregu, beige)
    draw_Text("www.liberkeys.com", firstPage, 15, 64, 8, ppregu, orange)

    // Récupère l'image
    var lienimage = photo;
    var pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
    var pngImage = await pdfDoc.embedPng(pngImageBytes)
    var pngDims = pngImage.scale(0.10)

    // Place l'image
    draw_Image(pngImage, firstPage, 167, 85, pngDims.width, pngDims.height)

    // Récupère le lien
    var lien_agent = format_agent(nom);
    const qrCode = get_QRCode(lien_agent);
    pngImageBytes = await qrCode.getRawData("png").then(res => res.arrayBuffer())
    pngImage = await pdfDoc.embedPng(pngImageBytes)
    pngDims = pngImage.scale(0.18)

    // Place le QRCode
    draw_Image(pngImage, firstPage, 180, 28, pngDims.width, pngDims.height)

    const pdfBytes = await pdfDoc.save()

    // Enregistre le fichier
    download(pdfBytes, 'CDV.pdf', "application/pdf");
}

async function flyer(nom, mail, metier, numero, fichier, photo) {
    var meilleure = metier == "Conseiller immobilier" ? " meilleur" : " meilleure";
    meilleure = "je serais votre" + meilleure;

    var allie = metier == "Conseiller immobilier" ? "allié " : "alliée ";
    allie = allie + "immobilier";

    // Récupère le fichier
    const url = fichier;
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Récupère les polices
    var lienfont = ppsansextra
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppextra = await pdfDoc.embedFont(fontBytes)

    var lienfont = ppsansregu
    var fontBytes = await fetch(lienfont).then(res => res.arrayBuffer())
    pdfDoc.registerFontkit(fontkit)
    const ppregu = await pdfDoc.embedFont(fontBytes)

    // Récupère les pages
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    // Place le nom, le métier, le numéro et le mail
    draw_Text(nom, firstPage, ((width - ppextra.widthOfTextAtSize(nom, 14)) / 2), 339, 14, ppextra, marron)
    draw_Text(meilleure, firstPage, ((width - ppregu.widthOfTextAtSize(meilleure, 20)) / 2), 406, 20, ppregu, marron)
    draw_Text(allie, firstPage, ((width - ppregu.widthOfTextAtSize(allie, 20)) / 2), 379, 20, ppregu, marron)
    draw_Text(metier, firstPage, ((width - ppregu.widthOfTextAtSize(metier, 14)) / 2), 320, 14, ppregu, marron)
    draw_Text(numero, firstPage, ((width - ppregu.widthOfTextAtSize(numero, 14)) / 2), 297, 14, ppregu, marron)
    draw_Text(mail, firstPage, ((width - ppregu.widthOfTextAtSize(mail, 14)) / 2), 275, 14, ppregu, marron)

    // Récupère l'image
    var lienimage = photo;
    var pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
    var pngImage = await pdfDoc.embedPng(pngImageBytes)
    var pngDims = pngImage.scale(0.12)

    // Place l'image
    draw_Image(pngImage, firstPage, 172, 490, pngDims.width, pngDims.height)

    // Récupère le lien
    var lien_agent = format_agent(nom);
    const qrCode = get_QRCode(lien_agent);
    pngImageBytes = await qrCode.getRawData("png").then(res => res.arrayBuffer())
    pngImage = await pdfDoc.embedPng(pngImageBytes)
    pngDims = pngImage.scale(0.28)

    // Place le QRCode
    draw_Image(pngImage, firstPage, 4, 14, pngDims.width, pngDims.height)

    const pdfBytes = await pdfDoc.save()

    // Enregistre le fichier
    download(pdfBytes, "FLYER.pdf", "application/pdf");
}

async function execute() {
    // var nom = document.getElementById("nom").value;
    // var mail = document.getElementById("email").value;
    // var numero = get_phone();
    // var photo = get_photo();
    // var metier = get_metier();
    var nom = "Prénom Nom";
    var numero = "06 01 02 03 04";
    var photo = "photo.png";
    var mail = "prenom.nom@liberkeys.com"
    var metier = "Conseiller immobilier";

    // panneau_simple(nom, numero, 'panneau_simple_av.pdf', photo);
    // panneau_simple(nom, numero, 'panneau_simple_vendu.pdf', photo);
    // panneau_double(nom, numero, 'panneau_double_av.pdf', photo);
    // panneau_double(nom, numero, 'panneau_double_vendu.pdf', photo);
    // carte_de_visite(nom, mail, metier, numero, 'carte_de_visite.pdf', photo);
    flyer(nom, mail, metier, numero, 'https://uploads-ssl.webflow.com/6022985415e9f66f2904c07b/65ccaffc965f2c21fd8ae20e_flyer.pdf', photo);
}