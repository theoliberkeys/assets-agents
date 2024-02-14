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
