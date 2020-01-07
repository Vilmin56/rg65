var axes;
var rg;
var Version = 0.01;
var lrg_coutures = 8; // en mm

window.onload = function ()
{
    $("#canvas").mousedown(on_canvas_mouse_down);
    $("#canvas").mousemove(on_canvas_mouse_move);
    $("#canvas").mouseup(on_canvas_mouse_up);
    $("#canvas").mouseout(on_canvas_mouse_up);
    $("#canvas").mousewheel(on_canvas_wheel);
    window.addEventListener('resize', resize, false);

    affiche_liste_modeles();

}
function affiche_liste_modeles()
{
	idb.open_db()
	.then(function(db){
	    idb.get_list_files()
	    .then(function(lst)
	    {
        let html = "<table style=\"width:100%;border:none;\"><tr><td><a href=\"javascript:nouveau();\">Nouveau</a></td><td></td>"
        lst.forEach(function(file)
        {
            html += "<tr><td style=\"width:80%\"><a href=\"javascript:charge_modele('" + file.nom + "')\">" + file.nom + "</td><td><a href=\"javascript:supprime_modele(\'"+file.nom
            + "\')\"><img src=\"images/supprimer.png\" alt=\"supprimer le modèle\" title=\"supprimer le modèle\" style=\"position:absolue;right:300px\"></a></td></tr>";
        });
        html += "</table>";
        html += "<br/><br/><center><input type=button value=\"Sauvegarder la base\" onclick=\"javascript:sauvegarde_base();\">";
        html += "&nbsp;&nbsp;<input type=button value=\"Restaurer la base\" onclick=\"javascript:restaure_base();\">";
        $("#fichiers").html(html);
	    })
	    .catch(function(msg)
	    {
	      // La base est vide
          // alert(msg);
          let html = "<lu><li><a href=\"javascript:nouveau();\">Nouveau</a></li></ul>";
          $("#fichiers").html(html);
	    });
	})
  .catch(function(err)
  {
      alert(err);
  });

}
function nouveau()
{
  rg = new rg65();
  // Jeu A
/*
  rg.nom = "Jeu_A00";
  rg.mat = new espar("mat", [{x:0, y:0}, {x:0, y:1100}, {x:6,  y:1100}, {x:8,  y:0}]);
  rg.tetiere = new espar("tetiere", [{x:0, y:1100}, {x:60, y:1100}, {x:60, y:1105}, {x:0, y:1110}]);
  rg.bome_gv = new espar("bome_gv", [{x:130,  y:5}, {x:-120, y:5},{x:-220, y:35},{x:-220, y:43}, {x:-120,  y:13},{x:130,  y:13}])
  rg.bome_foc = new espar("bome_foc", [{x:12, y:26},{x:185, y:26},{x:185, y:31},{x:12,  y:31}])
  rg.foc = new voile("foc", {x:15, y:45},
                           [{x:167, y:0}, {x:27, y:750}],
                           [{x:0,   y:0}, {x:0,  y:750}],
                           undefined, // bordure droite
                           [180, 360, 500],  // Laizes
                           lrg_coutures        // Largeur des coutures (ou autocollant)
                           );
  rg.gv = new voile("gv", {x:0, y:20},
                          [{x:0,   y:27}, {x:0,   y:267}, {x:0,   y:536}, {x:0,   y:806}, {x:0,  y:1066}],
                          [{x:202, y:27}, {x:179, y:267}, {x:147, y:536}, {x:106, y:806}, {x:62, y:1066}],
                          [{x:0, y:0}, {x:98, y:0}, {x:202, y:27}], // bordure
                           [100, 330, 470, 510], // Hauteur des laizes le long du guindant
                           lrg_coutures        // Largeur des coutures (ou autocollant)
                          );

  rg.coque = new coque({x:180, y:5}, {x:-340, y:5});
*/
  // Jeu B (classique)

  rg.nom = "Sans nom";
  rg.mat = new espar("mat", [{x:0, y:0}, {x:0, y:860}, {x:6, y:860}, {x:6, y:0}]);
  rg.tetiere = new espar("tetiere", [{x:6, y:860}, {x:-70, y:860}, {x:-70, y:865}, {x:6, y:870}]);
  rg.bome_gv = new espar("bome_gv", [{x:0, y:35}, {x:-270, y:35},{x:-270, y:40},{x:0, y:40}])
  rg.bome_foc = new espar("bome_foc", [{x:15, y:15},{x:220, y:15},{x:220, y:20},{x:15, y:20}])
  let pos = new point2d(rg.bome_foc.tp[3]);
  pos.y += 5;
  rg.foc = new voile("foc", pos,
                           [{x:200, y:0}, {x:27, y:650}],
                           [{x:0,   y:0}, {x:0,  y:650}],
                           undefined, // bordure droite
                           [180, 360, 500],  // Hauteurs des laizes
                           lrg_coutures        // Largeur des coutures (ou autocollant)
                           );
  pos = new point2d(rg.bome_gv.tp[0]);
  pos.y += 10;
  rg.gv = new voile("gv", pos,
                          [{x:0,   y:0}, {x:0,   y:200}, {x:0,   y:400}, {x:0,   y:600}, {x:0,  y:800}],
                          [{x:250, y:0}, {x:215, y:200}, {x:173, y:400}, {x:118, y:600}, {x:50, y:800}],
                          undefined, // bordure droite
                          [150, 300, 450, 600],
                          lrg_coutures
                          );
  rg.coque = new coque({x:180, y:5}, {x:-340, y:5});
  rg.renforts = new renforts();

  $("#tabswidget").jqxTabs("select", 1);

  // Calcul de l'échelle
  setup();
  // Ajuste le canvas à la taille de la fenêtre et affiche la voile
  render();

}
function charge_modele(nom)
{
	idb.get_file(nom)
	.then(function(obj){
		rg = new rg65(obj);
		setup();
		render();
	})
	.catch(function(msg){
		alert(msg);
	});
}
function supprime_modele(nom)
{
	if ((rg != undefined) && (rg.nom == nom))
	    alerte("Ce modèle est actif, vous ne pouvez pas le supprimer");
    else
    {
    	if (confirm("Supprimer " + nom + " ?"))
		idb.delete_file(nom)
		.then(function(obj){
			affiche_liste_modeles();
		})
		.catch(function(msg){
			alert(msg);
		});
    }
}
$(document).ready(function () {
    $('#splitter').jqxSplitter(
    {
      width: '99.8%',
      height: '93.8%',
      panels: [
        { size: '45%', min: 150},
        { size: '55%', min: 250}
      ]
    });

    $("#tabswidget").jqxTabs({  height: '100%', width: '100%' });

});
function setup()
{
	if (rg != undefined)
	{
		// Définition du canvas d'affichage
		var canvas = document.getElementById('canvas');
		canvas.height = document.body.clientHeight - 150;
		var ctx = canvas.getContext("2d");
		ctx.font = "12px Arial";

		// Vue de l'univers
		let u_min = rg.pmin();
		let u_max = rg.pmax();
		// Calcul des facteurs d'échelle
		var FZ;
		FZ = new point2d(ctx.canvas.width/(u_max.x+1 - u_min.x), ctx.canvas.height/(u_max.y - u_min.y));
		FZ.x = Math.min(FZ.x, FZ.y);
		FZ.y = FZ.x;

		var O = new point2d(-u_min.x*FZ.x, ctx.canvas.height + u_min.y*FZ.y);
		axes = new axis2d(ctx, O, FZ);
	}

}
function render()
{
	if (rg != undefined)
	{
		axes.ctx.clearRect(0, 0, axes.ctx.canvas.width, axes.ctx.canvas.height);
		axes.ctx.save();

		affiche_titre();
		// Affichage des coordonnées
		affiche_coord("foc");
		affiche_coord("gv");
		affiche_surfaces();
        affiche_greement();
		// Tracé des voiles
		//axes.trace_cadre();
		rg.trace(axes);
	}
}

function resize()
{
    if (document.body)
    {
        //console.log("resize:"+document.body.clientHeight);

        var canvas = document.getElementById('canvas');
        canvas.height = document.body.clientHeight-150;
        setup();
        render();
    }
}
// Evenements souris
//==================
// Positions de la souris
var mouse_pos = new point2d();	// Position courante de la souris
var mouse_pos1 = new point2d(); // Position précédente de la souris (dans le mouse_move)
var mouse_down = false;

function getMousePos(obj, evt)
{
    var rect = obj.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function on_canvas_mouse_down( event ) {
    //console.log("on_canvas_mouse_down");
    //event.preventDefault()
    mouse_down = true;
    mouse_pos1 = getMousePos(canvas, event);
}
function on_canvas_mouse_up( event ) {
    mouse_down = false;
}

function  on_canvas_mouse_move(event) {
    console.log("on_canvas_mouse_move")
    mouse_pos = getMousePos(canvas, event);

    if (axes != undefined)
    {
        // Mode scroll
        if (mouse_down)
        {
            var dp = new point2d(mouse_pos.x - mouse_pos1.x, mouse_pos.y  - mouse_pos1.y);
            axes.origin._move(dp);
        }
        mouse_pos1.x = mouse_pos.x;
        mouse_pos1.y = mouse_pos.y;
    }

}


function on_canvas_wheel( event ) {
    if (axes != undefined)
    {
        let pe = new point2d(event.offsetX, event.offsetY);
        let p0 = axes.to_univers(pe);
        let dz = event.deltaY/100;
        axes.fz.x += dz;
        axes.fz.y += dz;
        // Recentre le graphique sur le point zoomé
        let p1 = axes.to_univers(pe);
        // On corrige axes.origin pour que p0 ne bouge pas à l'écran
        axes.origin.x -= p0.x - p1.x;
        axes.origin.y -= p0.y - p1.y;

        render();
    }
}

function update(rg)
{
    localStorage.setItem('rg65', JSON.stringify(rg));
}
function affiche_titre()
{
    var div = document.getElementById("div_titre");
    div.innerHTML = rg.nom + "&nbsp;<a href=\"javascript:modif_titre();\"><img src=images/modifier.png></a>";
}
function modif_titre()
{
      var div = document.getElementById("div_titre");
    div.innerHTML = "<input type=text id=\"titre\" autofocus value=\"" + rg.nom + "\"><a href=\"javascript:enregistre_titre()\"><img src=\"images/fait.png\">";
    $("#titre")[0].select();
}
function enregistre_titre()
{
  var nom = $("#titre")[0].value;
  rg.nom = nom;
  affiche_titre();
}
// Affichage des coordonnées de la voile vl
function affiche_coord(vl)
{
    var div = document.getElementById("coord_"+vl);
    // Saisie de l'origine
    let O = (vl == 'foc') ? rg.foc.origine : rg.gv.origine;
    let i = -1;
    let html = '<table><tr><td colspan=2>Origine</td></tr>';
    html += '<tr><th>X</th><th>Y</th></tr> '
    html += '<tr id="dsp_'+vl+'_'+i+'">';
    html += '<td>' + O.x +'</td><td>'+O.y+'</td>';
    html += '<td>&nbsp;<a href=\"javascript:modif_coord(\''+vl+'\',' + i +')\"><img src=\"images/modifier.png\"></a></td></tr>';
    html += '<tr id="edt_'+vl+'_'+i+'" style="display:none">';
    html += '<td><input type="text" id="'+vl+'_x_'+i+'" name="'+vl+'_x_'+i+'" size=2 value=' + O.x+'></td>';
    html += '<td><input type="text" id="'+vl+'_y_'+i+'" name="'+vl+'_y_'+i+'" size=2 value=' + O.y+'></td>';
    html += '<td><a href=\"javascript:enregistre_origine(\''+vl+'\',' + i
    +')\"><img src=\"images/fait.png\"></a></td></tr>';
    html += '</table>'

    // Coordonnées
    html += "<table><tr><th>N°</th><th>Y</th><th>X Gd</th><th>X Ch</th></tr>";
    n = (vl == 'foc') ? rg.foc.guindant.length : rg.gv.guindant.length;
    for (i=0; i < n; i++)
    {
        let pg = (vl == 'foc') ? rg.foc.guindant[i] : rg.gv.guindant[i];
        let pc = (vl == 'foc') ? rg.foc.chute[i] : rg.gv.chute[i];
        html += '<tr id="dsp_'+vl+'_'+i+'"><td>'+i+'</td>';
        html += '<td>' + pg.y +'</td><td>'+pg.x+'</td><td>'+pc.x+'</td>';
        html += '<td>&nbsp;<a href=\"javascript:modif_coord(\''+vl+'\',' + i +')\"><img src=\"images/modifier.png\"></a></td></tr>';
        html += '<tr id="edt_'+vl+'_'+i+'" style="display:none"><td>'+i+'</td>';
        html += '<td><input type="text" id="'+vl+'_gy_'+i+'" name="'+vl+'_gy_'+i+'" size=2 value=' + pg.y+'></td>';
        html += '<td><input type="text" id="'+vl+'_gx_'+i+'" name="'+vl+'_gx_'+i+'" size=2 value=' + pg.x+'></td>';
        html += '<td><input type="text" id="'+vl+'_cx_'+i+'" name="'+vl+'_cx_'+i+'" size=2 value=' + pc.x+'></td>';
        html += '<td>&nbsp;<a href=\"javascript:supprime_coord(\''+vl+'\',' + i
        + ')\"><img src=\"images/supprimer.png\"></a>&nbsp;<a href=\"javascript:enregistre_coord(\''+vl+'\',' + i
        +')\"><img src=\"images/fait.png\"></a></td></tr>';
    };
    // Ligne nouvelles coordonnées
    html += '<tr id="dsp_'+vl+'_'+n+'"><td colspan=3></td><td><a href="javascript:modif_coord(\''+vl+'\',' + n + ');"><img src="images/ajouter.png"></a></td></tr>';
    html += '<tr id="edt_'+vl+'_'+n+'" style="display:none">';
    html += '<td><input type="text" id="'+vl+'_gy_'+n+'" name="'+vl+'_gy_'+n+'" size=2></td>';
    html += '<td><input type="text" id="'+vl+'_gx_'+n+'" name="'+vl+'_gx_'+n+'" size=2></td>';
    html += '<td><input type="text" id="'+vl+'_cx_'+n+'" name="'+vl+'_cx_'+n+'" size=2></td>';
    html +=  '<td><a href="javascript:enregistre_coord(\''+vl+'\',' + n + ');"><img src="images/fait.png"></a></td></tr>';
    html += "</table>";

    // Hauteur des laizes
    let lzs = (vl == 'foc') ? rg.foc.laizes : rg.gv.laizes;
    n = lzs.length;

    html += "<table><tr><th colspan=3>Laizes</th></tr><tr><th>N°</th><th>Y</th><th></th></tr>";

    for (i=0; i < n; i++)
    {
        html += '<tr id="dsp_'+vl+'_lz_'+i+'"><td>'+i+'</td>';
        html += '<td>' + lzs[i] +'</td>';
        html += '<td>&nbsp;<a href=\"javascript:modif_laize(\''+vl+'\',' + i +')\"><img src=\"images/modifier.png\"></a></td></tr>';

        html += '<tr id="edt_'+vl+'_lz_'+i+'" style="display:none">';
        html += '<td><input type="text" id="'+vl+'_lz_'+i+'" name="'+vl+'_lz_'+i+'" size=2 value='+lzs[i] +'></td>';
        html += '<td>&nbsp;<a href=\"javascript:supprime_laize(\''+vl+'\',' + i
        + ')\"><img src=\"images/supprimer.png\"></a>&nbsp;<a href=\"javascript:enregistre_laize(\''+vl+'\',' + i
        +')\"><img src=\"images/fait.png\"></a></td></tr>';
        html += '</tr>';
    }
    html += "</table>";
    div.innerHTML = html;
}
function modif_coord(vl, n)
{
        var tr_dsp =document.getElementById('dsp_'+vl+'_' + n);
        var tr_edt =document.getElementById('edt_'+vl+'_' + n);
        tr_dsp.style.display = "none";
        tr_edt.style.display = "";
}
function supprime_coord(vl, n)
{
    if (rg[vl] != undefined)
    {
    	delete rg[vl].tp.splice(n, 1);
    }
    update(rg);
    render();
}
function enregistre_origine(vl, n)
{
    let x = +$("#"+vl+"_x_"+n)[0].value;
    let y = +$("#"+vl+"_y_"+n)[0].value
    if (!isNaN(x) && !isNaN(y))
    {
        if (vl == 'foc')
        {
            rg.foc.origine = new point2d(x, y);
        }
        else
        {
            rg.gv.origine = new point2d(x, y);
        }
    }
    var tr_dsp =document.getElementById("dsp_"+vl+"_" + n);
    var tr_edt =document.getElementById("edt_"+vl+"_" + n);
    tr_dsp.style.display = "";
    tr_edt.style.display = "none";

    update(rg);
    render();

}
function enregistre_coord(vl, n)
{
    let gy = +$("#"+vl+"_gy_"+n)[0].value;
    let gx = +$("#"+vl+"_gx_"+n)[0].value
    let cx = +$("#"+vl+"_cx_"+n)[0].value
    if (!isNaN(gy) && !isNaN(gx)&& !isNaN(cx))
    {
        if (vl == 'foc')
        {
                rg.foc.guindant[n] = new point2d(gx, gy);
                rg.foc.chute[n] = new point2d(cx, gy);
        }
        else
        {
                rg.gv.guindant[n] = new point2d(gx, gy);
                rg.gv.chute[n] = new point2d(cx, gy);
        }
    }
    var tr_dsp =document.getElementById("dsp_"+vl+"_" + n);
    var tr_edt =document.getElementById("edt_"+vl+"_" + n);
    tr_dsp.style.display = "";
    tr_edt.style.display = "none";

    update(rg);
    render();
}
function enregistre_coord_espar(type, n)
{
    let x = +$("#"+type+"_x_"+n)[0].value;
    let y = +$("#"+type+"_y_"+n)[0].value
    if (!isNaN(y) && !isNaN(x))
    {
                rg[type].tp[n] = new point2d(x, y);
    }
    var tr_dsp =document.getElementById("dsp_"+type+"_" + n);
    var tr_edt =document.getElementById("edt_"+type+"_" + n);
    tr_dsp.style.display = "";
    tr_edt.style.display = "none";

    update(rg);
    render();
}


function modif_laize(vl, n)
{
        var tr_dsp =document.getElementById('dsp_'+vl+'_lz_' + n);
        var tr_edt =document.getElementById('edt_'+vl+'_lz_' + n);
        tr_dsp.style.display = "none";
        tr_edt.style.display = "";
}
function supprime_laize(vl, n)
{
    if (vl == 'foc')
    {
        delete rg.foc.laizes[n];
    }
    else if (vl = 'gv')
    {
        delete rg.gv.laizes[n];
    }
    update(rg);
    affiche_coord(vl);
}

function enregistre_laize(vl, n)
{
    let h = +$("#"+vl+"_lz_"+n)[0].value;
    if (!isNaN(h))
    {
        if (vl == 'foc')
        {
                rg.foc.laizes[n] = h;
        }
        else
        {
                rg.gv.laizes[n] = h;
        }
    }
    var tr_dsp =document.getElementById("dsp_"+vl+"_lz_" + n);
    var tr_edt =document.getElementById("edt_"+vl+"_lz_" + n);
    tr_dsp.style.display = "";
    tr_edt.style.display = "none";

    update(rg);
    render();
}

function affiche_surfaces()
{
    let osf = rg.foc.surface();
    let osg = rg.gv.surface();
    let sf = osf.s/100;
    let sg = osg.s/100;
    let st = sf + sg;
    let st_max = 2250;
    let ecart = 100*(st - st_max)/st_max;
    let cv = osf.cg.mult(osf.s).add(osg.cg.mult(osg.s)).mult(1/(100*st));
    var div = document.getElementById("div_surfaces");
    div.innerHTML = "<table><tr><th colspan=3>Surfaces</th></tr>"
    + "<tr><th>Foc</th><th>GV</th><th>Totale</th></tr>"
    + "<tr><td>" + sf.toFixed(1) + " cm²</td><td>"+ sg.toFixed(1) + " cm²</td><td>"
    + st.toFixed(1) + " cm² "+ ((st > st_max) ? "<font color=red>(+" + ecart.toFixed(1) + "%)</font>":"("+ecart.toFixed(1) + "%)")
    + "</td></tr>"
    + "<td colspan=3>Centre de voilure : x=" + cv.x.toFixed(1) + " mm</td></tr>"
    ;
    // Tracé des centres de voilure
    axes.ctx.lineWidth = "0.2";
    axes.ctx.beginPath();
    osf.cg.trace(axes, 3, false, "");
    osg.cg.trace(axes, 3, false, "");
    cv.trace(axes, 5, false, "");
    axes.ctx.stroke();
}
// Affichage du gréement dans l'onglet correspondant
// Affichage des coordonnées de la voile vl
function affiche_greement()
{
    var div = $("#greement");
    let html = "<table style=\"border:0px\"><tr>"
    html += "<td>" + rg.mat.affiche_coord() + "</td>";
    html += "<td>" + rg.tetiere.affiche_coord() + "</td></tr>";
    html += "<tr><td>" + rg.bome_gv.affiche_coord() + "</td>";
    html += "<td>" + rg.bome_foc.affiche_coord() + "</td></tr>";
    html += "<tr><td colspan=2 align=center><input type=\"button\" value=\"Enregistrer\" onclick=\"javascript:enregistrer();\"></td></tr>";
    html += "</table>";
    div.html(html);

    //"<th>Bôme GV</th><th>Bome foc</th><th>Tétière</th></tr>";

}



function enregistrer()
{
  	idb.open_db()
	.then(function(db){
	    idb.put_file(rg)
	    .then(function(msg)
	    {
	        if (msg != undefined)
              alert(msg);
	    })
	    .catch(function(msg)
	    {
	      alert(msg);
	    });
	});

}
function telecharger_modele()
{
	telecharge(JSON.stringify(rg, rg.nom + ".json"));
}
function fg(x)
{
  return x.toFixed(2);
}
function telecharger_gcode()
{
    //Création d'un objet LIEN
    var download = document.createElement('a');
    //Gcode pour le foc
    let tgcode = rg.foc.export_gcode();
    let n = 0;
    tgcode.forEach(function(gcode)
    {
        download.setAttribute('href',
        "data:text/plain;charset=utf-8,"+encodeURIComponent(gcode));

        //Nom du fichier
        download.setAttribute('download',
        rg.nom + "_foc_lz_" + n++ + ".gcode");
        //Simulation d'un click
        download.click();
    });
    //Gcode pour la GV
    tgcode = rg.gv.export_gcode();
    n = 0;
    tgcode.forEach(function(gcode)
    {
        download.setAttribute('href',
        "data:text/plain;charset=utf-8,"+encodeURIComponent(gcode));

        //Nom du fichier
        download.setAttribute('download', rg.nom + "_gv_lz_" + n++ + ".gcode");
        //Simulation d'un click
        download.click();
    });

    // Grands renforts
    let L = 100; // Longueur 
    let lb = 15; // Largeur à la base
    let le = 8; // Largeur à l'extémité
	let chemin = "Renforts_" + L + "x" + lb + "x" + le + ".gcode";
    let gcode = rg.renforts.export_gcode(10, L, lb, le);
    
    telecharge(gcode, chemin);

    L = 60; // Longueur 
    lb = 12; // Largeur à la base
    le = 8; // Largeur à l'extémité
	chemin = "Renforts_" + L + "x" + lb + "x" + le + ".gcode";
    gcode = rg.renforts.export_gcode(10, L, lb, le);
    telecharge(gcode, chemin);

}
// Télécharge un chaine s sous le nom nom
function telecharge(s, nom)
{
	//Création d'un objet LIEN
	var download = document.createElement('a');
	//contenu
	download.setAttribute('href',
	"data:text/plain;charset=utf-8,"+encodeURIComponent(s));

	//Nom du fichier
	download.setAttribute('download', nom);
	//Simulation d'un click
	download.click();						

}
function sauvegarde_base()
{
    idb.sauvegarde()
    .then(function(json)
    {
        telecharge(json, "rg65.json");
    })
    .catch(function(msg)
    {
    	alert("La sauvegarde a échoué : " . msg);
    })
}
