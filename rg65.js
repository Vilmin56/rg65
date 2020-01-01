var rg65 = function(obj)
{
	if (obj != undefined)
	{
		this.nom = obj.nom;
		this.version = obj.version
		this.foc = new voile(obj.foc.type, obj.foc.origine, obj.foc.guindant, obj.foc.chute, obj.foc.bordure, obj.foc.laizes, obj.gv.lrg_coutures);
		this.gv =  new voile(obj.gv.type, obj.gv.origine, obj.gv.guindant, obj.gv.chute, obj.gv.bordure, obj.gv.laizes, obj.gv.lrg_coutures);
		this.mat = new espar(obj.mat.type, obj.mat.tp);
		this.tetiere = new espar(obj.tetiere.type, obj.tetiere.tp);
		this.bome_gv = new espar(obj.bome_gv.type, obj.bome_gv.tp);
		this.bome_foc = new espar(obj.bome_foc.type, obj.bome_foc.tp);
		this.coque = new coque(obj.coque.etais, obj.coque.pataras);
	}
	else
	{
		this.nom = "";
		this.version = Version;
		this.foc = new voile();
		this.gv = new voile();	
		this.mat = new espar();
		this.tetiere = new espar();
		this.bome_gv = new espar();
		this.bome_foc = new espar();
		this.coque = new coque();
	}
}
rg65.prototype.pmin = function()
{
	let pm0 = this.foc.pmin();
	let pm1 = this.gv.pmin();
	let pm2 = this.mat.pmin();
	let pm3 = this.bome_gv.pmin();
	let pm4 = this.bome_foc.pmin();
	let pm5 = this.coque.pmin();
	let pm6 = this.tetiere.pmin();
	let pm = new point2d();
	pm.x = Math.min(pm0.x, pm1.x, pm2.x, pm3.x, pm4.x, pm5.x, pm6.x);
	pm.y = Math.min(pm0.y, pm1.y, pm2.y, pm3.y, pm4.y, pm5.y, pm6.y);
	return pm;
}
rg65.prototype.pmax = function()
{
	let pm0 = this.foc.pmax();
	let pm1 = this.gv.pmax();
	let pm2 = this.mat.pmax();
	let pm3 = this.bome_gv.pmax();
	let pm4 = this.bome_foc.pmax();
	let pm5 = this.coque.pmax();
	let pm6 = this.tetiere.pmax();
	let pm = new point2d();
	pm.x = Math.max(pm0.x, pm1.x, pm2.x, pm3.x, pm4.x, pm5.x, pm6.x);
	pm.y = Math.max(pm0.y, pm1.y, pm2.y, pm3.y, pm4.y, pm5.y, pm6.y);
	return pm;
}
rg65.prototype.trace = function(axes)
{
	this.mat.trace(axes);
	this.tetiere.trace(axes);
	this.bome_gv.trace(axes);
	this.bome_foc.trace(axes);

	this.foc.trace(axes);
	this.foc.trace_laizes(axes);
	this.gv.trace(axes)
	this.gv.trace_laizes(axes)

	this.coque.trace(axes);
	// Pataras
	axes.ctx.strokeStyle = "#000000";
	axes.ctx.lineWidth = "0.5";
	axes.ctx.setLineDash([]);
	axes.ctx.beginPath();
	axes.move_to(this.coque.pataras);
	axes.line_to(this.tetiere.tp[1]);
	axes.ctx.stroke();
}
// Objet Voile
//============
var voile = function(type, origine, guindant, chute, bordure, laizes, lrg_coutures)
{
	this.type = type // "foc" ou "gv"
	this.origine = origine;  // point2d 
	this.guindant = [];
	this.chute = [];
	this.bordure = [];	
	this.laizes = []; //Hauteur des laizes (float)	
	if (guindant != undefined)
	{
		guindant.forEach(function(p)
		{
			if (p!= null)
				this.guindant.push(new point2d(p.x, p.y));
		}, this);
	}
	if (chute != undefined)
	{
		chute.forEach(function(p)
		{
			if (p!= null)
				this.chute.push(new point2d(p.x, p.y));
		}, this);
	}
	if (bordure != undefined)
	{
		bordure.forEach(function(p)
		{
			if (p!= null)
				this.bordure.push(new point2d(p.x, p.y));
		}, this);
	}
	// Hauteur des laizes
	if (laizes != undefined)
	{
		laizes.forEach(function(h)
		{
			if (h!= null)
				this.laizes.push(h);
		}, this);
	}
	this.lrg_coutures = lrg_coutures;
}
// Coordonnées réelle (après translation et symétrie) du point tp[n]
voile.prototype.pr = function(p)
{
	return new point2d(this.origine.x + p.x*((this.type == "foc") ? 1 : -1), this.origine.y + p.y);
}
voile.prototype.pmin = function()
{
	let pm = new point2d(10E12, 10E12);
	this.guindant.forEach(function(p)
	{
		let pr = this.pr(p);
		if (pr.x < pm.x) pm.x = pr.x;
		if (pr.y < pm.y)	pm.y = pr.y;
	}, this);
	this.chute.forEach(function(p)
	{
		let pr = this.pr(p);
		if (pr.x < pm.x) pm.x = pr.x;
		if (pr.y < pm.y)	pm.y = pr.y;
	}, this);
	this.bordure.forEach(function(p)
	{
		let pr = this.pr(p);
		if (pr.x < pm.x) pm.x = pr.x;
		if (pr.y < pm.y)	pm.y = pr.y;
	}, this);

	return pm;
}
voile.prototype.pmax = function()
{
	let pm = new point2d(-10E12, -10E12);
	this.guindant.forEach(function(p)
	{
		let pr = this.pr(p);		
		if (pr.x > pm.x) pm.x = pr.x;
		if (pr.y > pm.y) pm.y = pr.y;
	}, this);
	this.chute.forEach(function(p)
	{
		let pr = this.pr(p);		
		if (pr.x > pm.x) pm.x = pr.x;
		if (pr.y > pm.y) pm.y = pr.y;
	}, this);
	this.bordure.forEach(function(p)
	{
		let pr = this.pr(p);		
		if (pr.x > pm.x) pm.x = pr.x;
		if (pr.y > pm.y) pm.y = pr.y;
	}, this);
	return pm;
}
voile.prototype.surface = function()
{
	let s = 0, st = 0;
	let cg = new point2d(0, 0);
	let cgg = new point2d(0, 0);
	// Longueur de la base
	let c1 = this.guindant[0].distance(this.chute[0]);
    // Milieu de la base
    let m1 = this.guindant[0].add(this.chute[0]).mult(0.5);
	for(let i=0; i < (this.guindant.length-1); i++)
	{
		let c2 = this.guindant[i+1].distance(this.chute[i+1]);
		let b = this.guindant[i].distance(this.guindant[i+1]);
		s = b*(c1+c2)/2;
		st += s;
        let m2 = this.guindant[i+1].add(this.chute[i+1]).mult(0.5);
        cg = m1.mult(2*c1+c2).add(m2.mult(c1+2*c2)).mult(1/(3*c1 + 3*c2));
        cgg = cgg.add(cg.mult(s));
		c1 = c2;
		m1 = m2;
	}
	// bordure
	if ((this.bordure != undefined) && (this.bordure.length > 0))
	{
		c1 = this.bordure[0].distance(this.guindant[0]);
        let m1 = this.guindant[0].add(this.chute[0]).mult(0.5);
		for(let i=0; i < (this.bordure.length-1); i++)
		{
			let c2 = this.guindant[0].y - this.bordure[i+1].y;
			let b = this.bordure[i+1].x - this.bordure[i].x
			s = b*(c1+c2)/2;
			st += s;
			let m2 = this.guindant[i+1].add(this.chute[i+1]).mult(0.5);
			cg = m1.mult(2*c1+c2).add(m2.mult(c1+2*c2)).mult(1/(3*c1 + 3*c2));
			cgg = cgg.add(cg.mult(s));
			c1 = c2;
			m1 = m2;		
		}
	}
	cg = this.pr(cgg.mult(1/st));
	s = st;
	return {s, cg};
}
voile.prototype.trace = function(axes)
{
	let i = 0;

	axes.ctx.strokeStyle = "#000000";
	axes.ctx.lineWidth = "0.5";
	axes.ctx.setLineDash([]);
	axes.ctx.beginPath();
	axes.move_to(this.pr(this.guindant[i]));
	// Guindant, en montant
	for (i = 1; i < this.guindant.length; i++)
	{
		let p = this.pr(this.guindant[i])
		axes.line_to(p);
	}	
	// Chute, en descendant (!)
	for (i = this.chute.length-1; i >= 0; i--)
	{
		let p = this.pr(this.chute[i]);
		axes.line_to(p);
	}
	// Bordure 
	if ((this.bordure != undefined) && (this.bordure.length > 0))
	{
	    for (i = this.bordure.length-1; i >= 0; i--)
		{
			let p = this.pr(this.bordure[i]);
			axes.line_to(p);
		}
		axes.line_to(this.pr(this.guindant[0]));
	}
    else
    {		
		axes.line_to(this.pr(this.guindant[0]));
	}
	axes.ctx.stroke();
}

// Calcul et tracé des laizes
//===========================
voile.prototype.calcul_laizes = function()
{
	let tlz= []; // Tableau de tableaux de points
	let lz = new polygon2d(); // Dessin de la laize
	let pg = new polygon2d(this.guindant);
	let pc = new polygon2d(this.chute);
	let p0, p1;
	let tp0, tp1;
	let i;
	// Laize 0, on commence par la bordure
	if (this.bordure.length > 0)
	{
		for (i=0; i < this.bordure.length; i++)
		{
			lz.push(this.bordure[i]);		
		}
	}
	else
	{
	   lz.push(this.chute[0]); 	
	   lz.push(this.guindant[0]); 	
	}
	for (i=0; i < this.laizes.length; i++)
	{
		// Droite horizontale à hauteur de la laize
		hlz = this.laizes[i];
		let ln = new line2d(new point2d(0, hlz), new point2d(100, hlz));
		tp0 = pg.line_intersection(ln);
		tp1 = pc.line_intersection(ln);
		// Prolonge les cotés de la largeur de la couture
		let l0 = new line2d(tp1[0], lz.p(0));
		p1 = l0.distance_p0(-this.lrg_coutures);
		let l1 = new line2d(tp0[0], lz.p(1));
		p0 = l1.distance_p0(-this.lrg_coutures);


		lz.push(new point2d(p0));
		let ple = pc.extract(p1, lz.p(0));
		for (let j=0; j < ple.nbp(); j++)
		{
			if (!lz.contains(ple.p(j)))
			    lz.push(new point2d(ple.p(j)));
		}
		lz.push(new point2d(p1));
		tlz.push(lz);
		lz = new polygon2d();
		lz.push(tp1[0]);
		lz.push(tp0[0]);	
	}
	// Laize du haut 
	lz.push(new point2d(this.guindant[this.guindant.length -1]));
	lz.push(new point2d(this.chute[this.chute.length -1]));
    tlz.push(lz);

	return tlz;
}


voile.prototype.trace_laizes = function(axes)
{
	// Laizes (en pointillés bleu)
    let tlz = this.calcul_laizes();
	axes.ctx.strokeStyle = "#990000";
	axes.ctx.lineWidth = "0.2";
	axes.ctx.setLineDash([3, 2]);
	axes.ctx.beginPath();
	tlz.forEach(function(pl)
    {
		axes.move_to(this.pr(pl.p(0)));
		for (i = 1; i < pl.nbp(); i++)
		{
			let p = this.pr(pl.p(i))
			axes.line_to(p);
		}
		// Ferme le polygone
		axes.line_to(this.pr(pl.p(0)));
    }, this);
    axes.ctx.stroke();	
}
voile.prototype.export_gcode = function()
{
	let tlz = this.calcul_laizes();
	let n = 0;
	let tgcode = [];
	tlz.forEach(function(lz)
	{

		// Ferme le polygone
		lz.push(new point2d(lz.p(0)));
		// Pour la gv, retourne la laize pour avoir le guindant à gauche
		if (this.type == "gv")
		    lz._mult(new point2d(-1, 1));

		// Place le point d'écoute du foc ou le point d'amure de la gv en 0
		lz._move(lz.p(0).mult(-1));

		let gcode = "(" + rg.nom + " " + this.type + " laize n° " + n + ")\r\n"; 
		gcode += "G21 (unité = mm)\r\n"; 
		gcode += "G91 (mode relatif)\r\n"; 
		gcode += "F1000 \r\n"; 
		gcode += "G00 X" + lz.p(0).x.toFixed(2) + " Y"  + lz.p(0).y.toFixed(2) + "\r\n"; 
		gcode += "G00 Z-5\r\n"; 

		gcode += lz.export_gcode(true/* mode relatif*/) + "\r\n";
		gcode += "G90 (mode absolu)\r\n"
		gcode += "G00 Z5\r\n"; 
		gcode += "G02 X0Y0\r\n";
		tgcode.push(gcode);
	}, this);
    return tgcode;
}

// Objet Espar
//============
var espar = function(type, tp)
{
	this.type = type;
	this.tp = [];
	if (tp != undefined)
	{
		tp.forEach(function(p)
		{
			this.tp.push(p);
		}, this);
	}
}
espar.prototype.pmin = function()
{
	let pm = new point2d(10E12, 10E12);
	this.tp.forEach(function(p)
	{
		if (p.x < pm.x) pm.x = p.x;
		if (p.y < pm.y)	pm.y = p.y;
	}, this);
	return pm;
}
espar.prototype.pmax = function()
{
	let pm = new point2d(-10E12, -10E12);
	this.tp.forEach(function(p)
	{
		if (p.x > pm.x) pm.x = p.x;
		if (p.y > pm.y) pm.y = p.y;
	}, this);
	return pm;
}
espar.prototype.trace = function(axes)
{
	let i = 0;
	axes.ctx.strokeStyle = "#000000";
	axes.ctx.lineWidth = "0.5";
	axes.ctx.setLineDash([]);
	axes.ctx.beginPath();
	axes.move_to(this.tp[i]);
	// Guindant, en montant
	for (i = 1; i < this.tp.length; i++)
	{
		axes.line_to(this.tp[i]);
	}
	axes.line_to(this.tp[0]);	
    axes.ctx.stroke();
}
// Objet coque
//============
var coque = function(etais, pataras)
{
	this.etais = new point2d(etais);
	this.pataras = new point2d(pataras);
}
coque.prototype.pmin = function()
{
	return new point2d(Math.min(this.etais.x, this.pataras.x), Math.min(this.etais.y, this.pataras.y));
}
coque.prototype.pmax = function()
{
	return new point2d(Math.max(this.etais.x, this.pataras.x), Math.max(this.etais.y, this.pataras.y));
}
coque.prototype.trace = function(axes)
{
	axes.ctx.strokeStyle = "#000000";
	axes.ctx.lineWidth = "0.5";
	axes.ctx.setLineDash([]);
	axes.ctx.beginPath();
	axes.move_to(this.etais);
	axes.line_to(new point2d(this.etais.x, 0));

	axes.line_to(new point2d(this.pataras.x, 0));
	axes.line_to(this.pataras);
	axes.ctx.stroke();
}
