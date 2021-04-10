document.addEventListener('DOMContentLoaded', function () {

	const playButton = document.getElementById('play');
	const pauseButton = document.getElementById('pause');
	const restartButton = document.getElementById('restart');

	pauseButton.addEventListener('click', function() { window.clearTimeout(tmHandle); });
	playButton.addEventListener('click', function() {  window.clearTimeout(tmHandle); tmHandle = setTimeout(draw, 1000 / fps); });
	restartButton.addEventListener('click', function() {restart();});

	function restart() 
	{ 
		window.clearTimeout(tmHandle); 

		bldg = [
			[up, buildY], 
			[up + build_wid, buildY], 
			[up + build_wid - build_3dwid, buildY + build_3dwid], 
			[up - build_3dwid, buildY + build_3dwid], 
			[up + build_wid, buildY + build_height], 
			[up + build_wid - build_3dwid, buildY + build_3dwid + build_height], 
			[up - build_3dwid, buildY + build_3dwid + build_height],
		];

		ball = [up + build_wid + 300, buildY + 100];
		
		dirn = 0;
		collis = 0;
		scale = 4;

		tmHandle = window.setTimeout(draw, 1000 / fps);
	}

	const slider_wid = document.getElementById("lineWidth");
	const output_wid = document.getElementById("demo_width");
	output_wid.innerHTML = slider_wid.value; // Display the default slider value

	slider_wid.oninput = function() {
		output_wid.innerHTML = this.value;
		lineWidth = 0.5 * Number(document.getElementById("lineWidth").value);
		stiff = 0.15 * Number(document.getElementById("lineWidth").value);
		fps = 3 + Number(document.getElementById("lineWidth").value); 
		restart();
	};

	const slider_mot = document.getElementById("motion");
	const output_mot = document.getElementById("demo_motion");
	output_mot.innerHTML = slider_mot.value; // Display the default slider value

	slider_mot.oninput = function() {
		output_mot.innerHTML = this.value;
		vibe = Number(document.getElementById("motion").value);
		restart();
	};

	const slider_mas = document.getElementById("mass");
	const output_mas = document.getElementById("demo_mass");
	output_mas.innerHTML = slider_mas.value; // Display the default slider value

	slider_mas.oninput = function() {
		output_mas.innerHTML = this.value;
		col = Number(document.getElementById("mass").value);
		mass_stiff = 0.2 * Number(document.getElementById("lineWidth").value);
		restart();
	};	

	function drawGround(ctx, ground)
	{
		ctx.save();
		ctx.fillStyle = "pink";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(ground[0][0], ground[0][1]);

		for(let i = 0; i < ground.length; ++i)
		{
			const next = (i + 1) % ground.length;
			ctx.lineTo(ground[next][0], ground[next][1]);
		}

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	let vibe = 75;

	const canvas = document.getElementById("main");
	canvas.width = 1200;
	canvas.height = 600;
	canvas.style = "border:3px solid";
	const ctx = canvas.getContext("2d");

	const col_arr= ["#e1fffe", "#b9fffc", "#55fff7", "#00f0e5", "#007872", "#00504c"];
	const border = "black";
	let col = 3;
	let fps = 10;
	let lineWidth = 3.5;

	let dirn = 0;
	let scale = 4;
	let stiff = 1.05;
	let mass_stiff = 0.6;

	const up = 400;
	const buildY = 100;
	const build_height = 375;
	const build_wid = 140;
	const build_3dwid = 35;

	let bldg = [
		[up, buildY], 
		[up + build_wid, buildY], 
		[up + build_wid - build_3dwid, buildY + build_3dwid], 
		[up - build_3dwid, buildY + build_3dwid], 
		[up + build_wid, buildY + build_height], 
		[up + build_wid - build_3dwid, buildY + build_3dwid + build_height], 
		[up - build_3dwid, buildY + build_3dwid + build_height],
	];

	let ball = [up + build_wid + 300, buildY + 100];

	const startL = 275;
	const startR = 925;
	const ground = [
		[startL - 60, buildY + build_height + 70],
		[startL, buildY + build_height - 70],
		[startR, buildY + build_height - 70],
		[startR - 60, buildY + build_height + 70]
	];

	const thickness = 15;
	const layer2 = [
		{...ground[0]},
		[ground[0][0], buildY + build_height + 70 + thickness],
		[startR - 55 , buildY + build_height + 70 + thickness],
		[ground[2][0] + 2, buildY + build_height - 60 + thickness],
		{...ground[2]},
		{...ground[3]},
	];

	let collis = 0;
	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = col_arr[col - 1];
		ctx.lineWidth = lineWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		drawGround(ctx, ground);
		drawGround(ctx, layer2);
		
		if(ball[0] > up + build_wid - (build_3dwid / 2) + 40 && collis === 0)
		{
			ball[0] -= (vibe / 4) * (10 / fps);
		}

		else
		{	
			collis += 0.25;
			if(ball[1] < buildY + build_height)
			{
				ball[0] += (vibe / 4) * (10 / fps);
				ball[1] += (vibe / 4 + collis) * (10 / fps);
			}	
			if(scale < vibe / 5)
			{
				if(dirn < 3 || dirn > 8)
				{
					bldg[0][0] -= vibe / scale;
					bldg[1][0] -= vibe / scale;
					bldg[2][0] -= (vibe) / scale;
					bldg[3][0] -= (vibe) / scale;
				}

				else if(dirn >= 3 && dirn <= 8)
				{
					bldg[0][0] += vibe / scale;
					bldg[1][0] += vibe / scale;
					bldg[2][0] += (vibe) / scale;
					bldg[3][0] += (vibe) / scale;
				}

				if(dirn === 11)
				{
					scale = scale + stiff + mass_stiff;
				}
				dirn = (dirn + 1) % 12;
			}	
		}

		//bldgTop
		ctx.beginPath();
		ctx.moveTo(bldg[0][0], bldg[0][1]);
		ctx.lineTo(bldg[1][0], bldg[1][1]);
		ctx.lineTo(bldg[2][0], bldg[2][1]);
		ctx.lineTo(bldg[3][0], bldg[3][1]);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		//bldgSide
		ctx.beginPath();
		ctx.moveTo(bldg[1][0], bldg[1][1]);
		ctx.lineTo(bldg[4][0], bldg[4][1]);
		ctx.lineTo(bldg[5][0], bldg[5][1]);
		ctx.lineTo(bldg[2][0], bldg[2][1]);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		//bldgFront
		ctx.beginPath();
		ctx.moveTo(bldg[2][0], bldg[2][1]);
		ctx.lineTo(bldg[5][0], bldg[5][1]);
		ctx.lineTo(bldg[6][0], bldg[6][1]);
		ctx.lineTo(bldg[3][0], bldg[3][1]);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		//Ball
		ctx.save();
		ctx.fillStyle = "#d3d3d3";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(ball[0], ball[1], 40, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();

		tmHandle = window.setTimeout(draw, 1000 / fps);
	}

	let tmHandle = window.setTimeout(draw, 1000 / fps);
})
