function rpg_dice_display() {
    const ZIndexTop = 99999;
    const BackgroundColor = "#ffffee";
    const TextColor = "#841a75";
    const ChartTextSize = 14;
    const ChartLineColor = "#000000";
    const ChartWidth = 250;
    const ChartHeight = 270;
    let m_rule = null;
    let m_chart = null;
    let m_error_display = null;

    function $get_element(id){
	return document.getElementById(id);
    }

    function get_rule(buffer) {
	if (m_rule)
	    return;

	try {
	    get_image_rule(buffer);
	} catch (e) {
	    // ignore errors while parsing rules.
	}

	get_text_rule();
    }

    function get_image_rule(buffer) {
	if (m_rule)
	    return;

	let jpeg_op = jpeg_operations_constructor(buffer);
	let rule_cand = rpg_dice_rule(jpeg_op.get_comment());
	if (rule_cand.rules())
	    m_rule = rule_cand;
    }

    function get_text_rule() {
	if (m_rule)
	    return;

	let dice_element_list = rpg_dice_html_extract().extract();
	for (let i=0; i<dice_element_list.length; i++) {
	    let elem = dice_element_list[i].element;

	    try {
		let rule_cand = rpg_dice_rule(elem.innerHTML);

		if (rule_cand.rules()) {
		    m_rule = rule_cand;
		    return;
		}
	    } catch(e) {
		// ignore errors while parsing rules.
	    }
	}
    }

    function move_form(){
	let text_area = $get_element('ftbl');
	let pos_dummy = $get_element('ufm');

	if (!text_area || !pos_dummy)
	    return;
	text_area.style.top = pos_dummy.offsetTop + 'px';
    }


    function has_displayed(element) {
	let elements = element.getElementsByClassName('imodice_show');
	return (elements.length > 0);
    }

    function append_display(element, dice) {
	let applied = m_rule.apply(dice);
	let disp = applied.map( a => a.disp + a.delimiter).join("");
	let div = document.createElement('div');
	div.className = "imodice_show";
	div.innerHTML = `<font color='${TextColor}' size='-1'>${disp}</font>`;

	let names = [];
	let values = [];
	let pip_values = [];
	for (let i=0; i<applied.length; i++) {
	    if (!applied[i].is_pip_value) {
		names.push(applied[i].name);
		values.push(applied[i].value);
	    } else {
		pip_values.push(applied[i].disp);
	    }
	}

	div.onmouseover = function() {
	    show_chart(dice.dice_value_max, names, values, pip_values);
	};

	element.appendChild(div);
    }

    function show_proc() {
	if (!m_rule) {
	    throw new Error("no rule found");
	    return;
	}

	let dice_element_list = rpg_dice_html_extract().extract();
	for (let i=0; i<dice_element_list.length; i++) {
	    let element = dice_element_list[i].element;
	    if(has_displayed(element))
	       continue;

	    let dice = dice_element_list[i].dice;
	    if (dice)
		append_display(element, dice);
	}
    }

    function display_rule_error(e) {
	if (!m_error_display) {
	    m_error_display = document.createElement('div');
	    m_error_display.style.zIndex = ZIndexTop;
	    m_error_display.style.position = "fixed";
	    m_error_display.style.top = 0;
	    m_error_display.style.right = 0;
	    m_error_display.style.backgroundColor = "red";
	    m_error_display.onclick = () => m_error_display.style.display = "none";

	    document.body.appendChild(m_error_display);
	}

	let error_message = "IMODICE ERROR!:" + e.message;
	console.log(error_message);
	m_error_display.innerHTML = error_message;
	m_error_display.style.display = "";
    }

    function show(strict_mode=true) {
	if (!m_rule) {
	    rpg_dice_html_extract().
		extract_image().
		then(get_rule).
		then(show_proc).
		then(move_form).
		catch(display_rule_error);
	} else {
	    show_proc();
	    move_form();
	}
    }

    function hide() {
    }

    function show_chart(max_value, names, values, pip_values) {
	function pos(val, rad) {
	    let x = val/max_value*R*Math.cos(rad) + cx;
	    let y = -val/max_value*R*Math.sin(rad) + cy;

	    return {x:x, y:y};
	}

	function draw_guide_background() {
	    let rad = Math.PI/2;
	    let p = pos(max_value, rad);

	    ctx.fillStyle = BackgroundColor;
	    ctx.fillRect(0, 0, ChartWidth, ChartHeight);
	}

	function draw_label(x, y, name, value) {
	    let text = name ? `${name}:` : "";
	    text += value;
	    ctx.fillStyle = TextColor;
	    ctx.font = `${ChartTextSize}px Arial`;

	    let w = ctx.measureText(text).width;
	    let h = ChartTextSize;

	    x = (x < cx) ? x : x+h;
	    y = (y < cy) ? y : y+w;

	    x = Math.max(0, x-w/2);
	    x = Math.min(x, ChartWidth-w);
	    y = Math.max(h, y);
	    y = Math.min(y, ChartWidth-h);

	    ctx.fillText(text, x, y);
	}

	function draw_guide_foreground(N) {
	    let rad = Math.PI/2;

	    for (let i=0; i<N; i++) {
		let p = pos(max_value, rad);
		ctx.strokeStyle = ChartLineColor;
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.lineTo(p.x, p.y);
		ctx.closePath();
		ctx.stroke();
		rad -= 2*Math.PI/N;

		draw_label(p.x, p.y, names[i], values[i]);
	    }

	    const RN = 4;
	    for (let i=1; i<=RN; i++) {
		let r = R*i/RN;
		ctx.strokeStyle = ChartLineColor;
		ctx.beginPath();
		ctx.arc(cx, cy, r, 0.0, 2*Math.PI);
		ctx.closePath();
		ctx.stroke();
	    }
	}

	function draw_pip_text() {
	    if (pip_values.length <= 0)
		return;
	    let text = pip_values.reduce((a,b)=> a+" "+b);
	    const Margin = 4;

	    ctx.fillStyle = TextColor;
	    ctx.font = `${ChartTextSize}px Arial`;
	    ctx.fillText(text, Margin, ChartHeight-Margin, ChartWidth - 2*Margin);
	}

	if (values.length < 3) {
	    hide_chart();
	    return;
	}

	const CeilMargin = 0.10;
	let intensity = values.reduce((a,b)=>a+b) / (max_value*values.length);
	intensity = (intensity-0.5)*0.5/(0.5-CeilMargin) + 0.5;
	intensity = Math.min(1.0, intensity);
	intensity = Math.max(0.0, intensity);

	let r_col;
	let b_col;

	if (intensity < 0.50) {
	    r_col = Math.floor(2*intensity*255);
	    b_col = 255;
	} else {
	    r_col = 255;
	    b_col = Math.floor((1-2*(intensity-0.5))*255);
	}

	let graph_color = `rgb(${r_col}, 0, ${b_col})`;
	if (!m_chart) {
	    m_chart = document.createElement('canvas');
	    m_chart.id = "imodice_chart";
	    m_chart.width = ChartWidth;
	    m_chart.height = ChartHeight;
	    m_chart.style.zIndex = ZIndexTop;
	    m_chart.style.position = "fixed";
	    m_chart.style.top = 0;
	    m_chart.style.right = 0;
	    m_chart.onclick = () => hide_chart();
	    document.body.appendChild(m_chart);
	}
	let dc = $get_element('imodice_chart');
	dc.style.display = "none";

	let ctx = m_chart.getContext('2d');

	let R = ChartWidth * 0.90 / 2;
	let cx = ChartWidth/2;
	let cy = cx;
	let N = values.length;

	draw_guide_background(N);
	ctx.fillStyle = graph_color;
	let rad = Math.PI/2;
	let p = pos(values[0], rad);
	ctx.beginPath();
	ctx.moveTo(p.x, p.y);
	for (let i=1; i<N; i++) {
	    rad -= 2*Math.PI/N;
	    p = pos(values[i], rad);
	    ctx.lineTo(p.x, p.y);
	}
	ctx.closePath();
	ctx.fill();

	draw_guide_foreground(N);
	draw_pip_text();

	dc.style.display = "";
    }

    function hide_chart() {
	if (!m_chart)
	    return;

	$get_element('imodice_chart').style.display = "none";
    }

    return { show: show,
	     hide: hide,
	     show_chart: show_chart,
	     hide_chart: hide_chart
    };
}

exports.rpg_dice_display = rpg_dice_display;
