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

// Récupère le RSAC
function get_RSAC() {
    var rsac = document.getElementById("rsac").value;
    return "Agent commercial indépendant au nom de Liberkeys - R.S.A.C " + rsac;
}

// Récupère la photo
function get_photo() {
    var imageInput = document.getElementById('imageInput');
    var image1 = new Image();
    console.log(imageInput.files[0])
    console.log(imageInput)
    try {
        image1.src = URL.createObjectURL(imageInput.files[0]);
    } catch (error) {
        return null;
    }
    return image1.src;
}

// Génère le QRCode
function get_QRCode(lien_agent) {
    const CodeQR = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "png",
        data: `https://liberkeys.com/agents/${lien_agent}`,
        image: "https://uploads-ssl.webflow.com/6022985415e9f66f2904c07b/65eed933aa7b1a8118ed5b37_lk.png",
        margin: 0,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q"
        },
        imageOptions: {
            crossOrigin: "anonymous",
            imageSize: 0.3,
            margin: 0
        },
        dotsOptions: {
            type: "square",
            color: "#241c1a"
        },
        backgroundOptions: {
            color: "#ffffff"
        },
        dotsOptionsHelper: {
            colorType: {
                single: true,
                gradient: false
            },
            gradient: {
                linear: true,
                radial: false,
                color1: "#6a1a4c",
                color2: "#6a1a4c",
                rotation: "0"
            }
        },
        cornersDotOptions: {
            type: "square",
            color: "#241c1a"
        }
    });
    return CodeQR;
}

async function image_to_png(imgValue) {
    let pngImageBytes = await fetch(imgValue).then(res => res.arrayBuffer())
    return pngImageBytes;
}

async function qr_to_png(lien_agent) {
    const qrCode = new QRCodeStyling({
        width: 400,
        height: 400,
        type: "png",
        data: `https://liberkeys.com/agents/${lien_agent}`,
        image: "https://uploads-ssl.webflow.com/6022985415e9f66f2904c07b/65eed933aa7b1a8118ed5b37_lk.png",
        margin: 0,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q"
        },
        imageOptions: {
            crossOrigin: "anonymous",
            imageSize: 0.4,
            margin: 0
        },
        dotsOptions: {
            type: "square",
            color: "#241c1a"
        },
        backgroundOptions: {
            color: "#ffffff"
        },
        dotsOptionsHelper: {
            colorType: {
                single: true,
                gradient: false
            },
            gradient: {
                linear: true,
                radial: false,
                color1: "#6a1a4c",
                color2: "#6a1a4c",
                rotation: "0"
            }
        },
        cornersDotOptions: {
            type: "square",
            color: "#241c1a"
        }
    });
    let pngImageBytes = await qrCode.getRawData("png").then(res => res.arrayBuffer())
    return pngImageBytes;
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

// Dessine du texte sur la page
function draw_Text(source, page, axeX, axeY, taille, police, couleur, angle) {
    
    // Dessine le texte à la position spécifiée
    page.drawText(source, {
        x: axeX,
        y: axeY,
        size: taille,
        font: police,
        color: couleur,
        rotate: degrees(angle),
    });
}

// Récupère les bibliothèques nécessaires
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

// Définition des couleurs
var beige = rgb(0.99, 0.95, 0.93);
var marron = rgb(0.14, 0.11, 0.10);
var orange = rgb(0.93, 0.58, 0.45);
var rouge = rgb(1, 0, 0);

// Définition de la police
var ppsansregu = 'https://cdn.jsdelivr.net/gh/theoliberkeys/assets-agents/ppsansregu.otf';
var ppsansextra = 'https://cdn.jsdelivr.net/gh/theoliberkeys/assets-agents/ppsansextra.otf';

// Fonction pour réaliser un panneau simple
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
    if (photo != null) {
        draw_Text(nom, firstPage, (630 - (excedent * 14)), 185, Math.round(145 - (excedent * 2.9)), ppregu, orange, 0)
        draw_Text(numero, firstPage, ((width - ppextra.widthOfTextAtSize(numero, 200)) / 2), 400, 200, ppextra, marron, 0)
        // Récupère l'image
        const lienimage = photo;
        const pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
        const pngImage = await pdfDoc.embedPng(pngImageBytes)
        const pngDims = pngImage.scale(0.5)
        // Place l'image
        draw_Image(pngImage, firstPage, (250 - (excedent * 10)), 60, (pngDims.width - (excedent * 2)), (pngDims.height - (excedent * 2)))
    } else {
        draw_Text(numero, firstPage, ((width - ppextra.widthOfTextAtSize(numero, 200)) / 2), 390, 200, ppextra, marron, 0)
        draw_Text(nom, firstPage, ((width - ppregu.widthOfTextAtSize(nom, Math.round(145 - (excedent * 1.75)))) / 2), 185, Math.round(145 - (excedent * 1.75)), ppregu, orange, 0)
    }

    const pdfBytes = await pdfDoc.save()

    // Enregistre le fichier
    return pdfBytes;
}


// Fonction pour réaliser un panneau double
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
    if (photo != null) {
        draw_Text(nom, firstPage, (505 - (excedent * 7)), 240, (130 - (excedent * 3)), ppregu, orange, 0)
        draw_Text(nom, firstPage, (2205 - (excedent * 7)), 240, (130 - (excedent * 3)), ppregu, orange, 0)
        // Récupère l'image
        const lienimage = photo;
        const pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
        const pngImage = await pdfDoc.embedPng(pngImageBytes)
        const pngDims = pngImage.scale(0.475)
        // Place l'image
        draw_Image(pngImage, firstPage, (170 - (excedent * 7)), 85, pngDims.width, pngDims.height)
        draw_Image(pngImage, firstPage, (1870 - (excedent * 7)), 85, pngDims.width, pngDims.height)

    } else {
        draw_Text(nom, firstPage, (width / 2 - ppregu.widthOfTextAtSize(nom, Math.round(130 - (excedent * 2)))) / 2, 240, (130 - (excedent * 2)), ppregu, orange, 0)
        draw_Text(nom, firstPage, (width / 2 - ppregu.widthOfTextAtSize(nom, Math.round(130 - (excedent * 2)))) / 2 + width / 2, 240, (130 - (excedent * 2)), ppregu, orange, 0)
    }

    draw_Text(numero, firstPage, (width / 2 - ppextra.widthOfTextAtSize(numero, 164)) / 2, 467, 164, ppextra, marron, 0)
    draw_Text(numero, firstPage, (width / 2 - ppextra.widthOfTextAtSize(numero, 164)) / 2 + width / 2, 467, 164, ppextra, marron, 0)

    const pdfBytes = await pdfDoc.save()

    // Enregistre le fichier
    return pdfBytes;
}


// Fonction pour réaliser la carte de visite
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
    var mail_excedent = mail.length > 35 ? Math.round((mail.length - 35) / 6) : 0;

    // Place le nom, le métier, le numéro et le mail
    draw_Text(nom, firstPage, 15, 136, 10 - (excedent / 11), ppextra, orange, 0);
    draw_Text(metier, firstPage, 15, 118, 10, ppregu, beige, 0);
    draw_Text(numero, firstPage, 15, 100, 8, ppregu, beige, 0);
    draw_Text(mail, firstPage, 15, 82, 8 - mail_excedent, ppregu, beige, 0);
    draw_Text("www.liberkeys.com", firstPage, 15, 64, 8, ppregu, orange, 0);

    // Récupère le RSAC
    const rsacText = get_RSAC();
    console.log(rsacText);
    draw_Text(rsacText, firstPage, 15, 18, 3, ppregu, beige, 0);

    // Récupère l'image
    if(photo != null) {
        var lienimage = photo;
        var pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
        var pngImage = await pdfDoc.embedPng(pngImageBytes)
        var pngDims = pngImage.scale(0.10)
    
        // Place l'image
        draw_Image(pngImage, firstPage, 167, 85, pngDims.width, pngDims.height)
    }

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
    return pdfBytes;
}

// Fonction pour réaliser le flyer
async function flyer(nom, mail, metier, numero, fichier, photo) {
    var meilleure = metier == "Conseiller immobilier" ? " meilleur" : " meilleure";
    meilleure = "je serai votre" + meilleure;

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
    draw_Text(nom, firstPage, ((width - ppextra.widthOfTextAtSize(nom, 14)) / 2), 329, 14, ppextra, marron, 0)
    draw_Text(meilleure, firstPage, ((width - ppregu.widthOfTextAtSize(meilleure, 20)) / 2), 396, 20, ppregu, marron, 0)
    draw_Text(allie, firstPage, ((width - ppregu.widthOfTextAtSize(allie, 20)) / 2), 369, 20, ppregu, marron, 0)
    draw_Text(metier, firstPage, ((width - ppregu.widthOfTextAtSize(metier, 14)) / 2), 310, 14, ppregu, marron, 0)
    draw_Text(numero, firstPage, ((width - ppregu.widthOfTextAtSize(numero, 14)) / 2), 287, 14, ppregu, marron, 0)
    draw_Text(mail, firstPage, ((width - ppregu.widthOfTextAtSize(mail, 14)) / 2), 265, 14, ppregu, marron, 0)

    // Récupère le RSAC
    const rsacText = get_RSAC() + " - Ne pas jeter sur la voie publique";
    draw_Text(rsacText, firstPage, (width - 15), 265, 4, ppregu, marron, 90);

    // Récupère l'image
    if(photo != null) {
        var lienimage = photo;
        var pngImageBytes = await fetch(lienimage).then(res => res.arrayBuffer())
        var pngImage = await pdfDoc.embedPng(pngImageBytes)
        var pngDims = pngImage.scale(0.12)

        // Place l'image
        draw_Image(pngImage, firstPage, 172, 485, pngDims.width, pngDims.height)
    }

    // Récupère le lien
    var lien_agent = format_agent(nom);
    const qrCode = get_QRCode(lien_agent);
    pngImageBytes = await qrCode.getRawData("png").then(res => res.arrayBuffer())
    pngImage = await pdfDoc.embedPng(pngImageBytes)
    pngDims = pngImage.scale(0.18)

    // Place le QRCode
    draw_Image(pngImage, firstPage, 15, 23, pngDims.width, pngDims.height)

    const pdfBytes = await pdfDoc.save()

    // Enregistre le fichier
    return pdfBytes;
}
