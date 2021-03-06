/*
	author: @nixzhu (zhuhongxu@gmail.com)
	description: 实现围棋的落子逻辑（包括提吃和打劫的处理）
	license: GPL
*/

import { P } from "core-js/modules/_export";

/* some global values */
var shadow = new Array(
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
);
var jie = new Array();
var move_record = new Array();
var color_black = 1;
var color_white = -1;
var color_empty = 0;


export function showPan() {
	var c = document.getElementById("weiqi");
	var cxt = c.getContext("2d");
	cxt.strokeStyle="black";
	
	/* 清空，重新画线等 */
	cxt.clearRect(0,0,600,600);
	cxt.fillStyle = "sandybrown";
	cxt.fillRect(0,0,600,600);
	grid(cxt);
	ninePoints(cxt);

	for (var i = 0; i < 19; i++) {
		for (var j = 0; j < 19; j++) {
			if (pan[i][j] === 1) { //black
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(1, /*"black"*/"#202020");
				rg.addColorStop(0, "gray");
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				//cxt.fillStyle="black";
				cxt.fillStyle=rg;
				cxt.fill();
				
			}
			else if (pan[i][j] === -1) { //white
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(1, /*"lightgray"*/"#e0e0e0");
				rg.addColorStop(0, "white");
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				//cxt.fillStyle="white";
				cxt.fillStyle=rg;
				cxt.fill();
			}
			else if (pan[i][j] === 7) { // fill color
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle="red";
				cxt.fill();
			}
		}
	}
	// 显示手数
	if (move_show_flag) {
		for (var m = 0; m < move_record.length-1; m++) { // 最新的一手由后面的红色标记
			// 先判断一下棋子还在不在棋盘上
			if (pan[move_record[m][0]][move_record[m][1]] === 0)
				continue;

			// 而且只应该画最新的数字（打劫后，可能导致一个坐标上重复许多步数）
			var repeat_move_flag = false;
			for (var j = m+1; j < move_record.length; j++) {
				if (move_record[m][0] === move_record[j][0] &&
						move_record[m][1] === move_record[j][1]) {
					repeat_move_flag = true;
					break;
				}
			}
			if (repeat_move_flag)
				continue;

			// 这下可以放心绘制手数数字啦
			if (move_record[m][2] % 2 === 1) { //black
				cxt.fillStyle="white";
			} else {
				cxt.fillStyle="black";
			}
			cxt.font="bold 18px sans-serif";
			if (move_record[m][2] > 99) {
				cxt.font="bold 16px sans-serif";
			}
			cxt.font="bold 16px sans-serif";
			cxt.textAlign="center";
			var move_msg = move_record[m][2].toString();
			//cxt.fillText(move_msg, (i+1)*30, (j+1)*30+6);
			cxt.fillText(move_msg, (move_record[m][0]+1)*30, (move_record[m][1]+1)*30+6);
		}
	}
	// 特别显示最新的一手
	if (move_record.length > 0) {
		cxt.fillStyle = "red";
		var newest_move = move_record.length-1;
		cxt.fillRect(
			(move_record[newest_move][0]+1)*30-5, 
			(move_record[newest_move][1]+1)*30-5, 
			10, 10
		);
	}
}

let move_count = 1;
export function play(pan, row, col) {
	if (row < 0 || row > 19 || col < 0 || col > 19) {
		alert("index error....");
		return pan;
	}
	// 处理已有棋子在此
	if (pan[row][col] != 0) {
		return pan;
	}

	var can_down = false; // 是否可落子
	// 得到将落子的棋子的颜色
	var color = color_black;
	if (move_count % 2 === 0) {
		color = color_white; 
	}

	if (!have_air(pan, row, col)) {
		if (have_my_people(pan, row, col)) {
			make_shadow(pan);


			flood_fill(row, col, color);	
			if (fill_block_have_air(pan, row, col, color)) {
				can_down = true;
				var dead_body = new Array();
				can_eat(pan, row, col, color, dead_body);
				clean_dead_body(pan, dead_body);
			} else {
				var dead_body = new Array();
				var cret = can_eat(pan, row, col, color, dead_body);
				clean_dead_body(pan, dead_body);

				if (cret) {
					can_down = true;
				} else {
					alert("无气，不能落子！！");
				}
			}
		} else {
			var dead_body = new Array();
			var cret = can_eat(pan, row, col, color, dead_body);

			// 劫争也应该在此处理，只在此处理？
			if (cret) {
				if (!is_jie(row, col, dead_body)) {
					clean_dead_body(pan, dead_body);
					can_down = true;
				} else {
					alert("劫, 不能落子, 请至少隔一手棋！");
				}	
			}
		}
	} else {
		can_down = true;
		var dead_body = new Array();
		can_eat(pan, row, col, color, dead_body);
		clean_dead_body(pan, dead_body);
	}
	if (can_down) {
		stone_down(pan, row, col);
	}
	return pan;
}

// TODO 劫争处理的本质是防止全局同型，基于此，还是要处理连环劫之类的，再说吧
// 我先看看应氏围棋规则，研究研究
function is_jie(row, col, dead_body) { //是否劫
	//只吃了一个？ 希望我对围棋的理解没错，单劫都是只互吃一个。
	if (dead_body.length === 1) {
		for (var i = 0; i < jie.length; i++) {
			//若符合（有坐标，且move_count就是上一手）
			//注意此处比较的是死去的棋子，下面push的是本次落子的棋子
			if (	jie[i][0] === dead_body[0][0] && 
					jie[i][1] === dead_body[0][1] && 
					jie[i][2] === move_count) {
				return true;
			}
		}
		//加入记录表
		jie.push([row, col, move_count+1]);
		return false;
	}
	return false;
}

/**
 * 死子计算和检测
 * @param color：当前落子的颜色
 * 
 * 
 */
export function can_eat(pan, row, col, color, dead_body) { // color 是当前要落子的颜色
	var ret = false;
	var anti_color = color_white;
	if (color === color_white)
		anti_color = color_black;		//anti：反方

	if (row+1 <= 19-1 && pan[row+1][col] === anti_color) {
		make_shadow(pan);
		shadow[row][col] = color;
		flood_fill(row+1, col, anti_color);
		console.log('shadow: -------');
		console.log(shadow);
		if (!anti_fill_block_have_air(pan, anti_color)) {
			// 记录下这些7的坐标，以及(row+1,col)，表示可以提吃的对方棋子
			//alert("提吃: "+(row+1).toString()+","+col.toString());
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (row-1 >= 0 && pan[row-1][col] === anti_color) {
		make_shadow(pan);
		shadow[row][col] = color;
		flood_fill(row-1, col, anti_color);
		console.log('shadow---------------');
		console.log(shadow);
		if (!anti_fill_block_have_air(pan, anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (col+1 <= 19-1 && pan[row][col+1] === anti_color) {
		make_shadow(pan);
		shadow[row][col] = color;
		flood_fill(row, col+1, anti_color);
		console.log('shadow---------------');
		console.log(shadow);
		if (!anti_fill_block_have_air(pan, anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (col-1 >= 0 && pan[row][col-1] === anti_color) {
		make_shadow(pan);
		shadow[row][col] = color;
		flood_fill(row, col-1, anti_color);
		console.log('shadow---------------');
		console.log(shadow);
		if (!anti_fill_block_have_air(pan, anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	return ret;
}

/**
 * 记录死亡的棋子
 * 
 * @param {*} db 
 * @returns 
 */
export function record_dead_body(db) {
	var ret = false;
	for (var row = 0; row < shadow.length; row++) {
		for (var col = 0; col < shadow[row].length; col++) {
			if (shadow[row][col] === 7) {
				db.push([row, col]);
				ret = true; // it's true have dead body
				//alert("DEAD: "+(row).toString()+","+col.toString());
			}
		}
	}
	return ret;
}

/**
 * 清除死子操作
 * @param {} db 
 */
export function clean_dead_body(pan, db) {
	console.log('db: -------');
	console.log(db);
	db.forEach(item => {
		pan[item[0]][item[1]] = 0;
	});
}

/**
 * 填充的区域周围是否有空
 * 
 */
export function fill_block_have_air(pan, row, col, color) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			if (i !== row || j !== col) {
				if (shadow[i][j] === 7 && pan[i][j] !== color) {
					return true; // 此块有空，可下
				}
			}
		}
	}
	//alert("fill block 无气！！！");
	return false;
}
/**
 * 提吃判断专用 
 * color当前下棋方的反方棋子。
 * 
 * 
 */
export function anti_fill_block_have_air(pan, color) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			if (shadow[i][j] === 7 && pan[i][j] !== color) {
				return true; // 活
			}                                                                                                                                                                 
		}
	}
	//alert("anti fill block 无气！！！");
	return false; //死
}

/**
 * 将盘面做个影分身 
 * 
 * 
 */
export function make_shadow(pan) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			shadow[i][j] = pan[i][j];
		}
	}
}
export function shadow_to_pan(pan) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			pan[i][j] = shadow[i][j];
		}
	}
}

/**
 * 泛洪填充，只操作影分身
 */
export function flood_fill(row, col, color) { // color 为当前要填充的颜色
	if (row < 0 || row > 19-1 || col < 0 || col > 19-1)
		return;
	
	if ((shadow[row][col] === color || shadow[row][col] === color_empty) && shadow[row][col] !== 7) { // color颜色或者空点，且未被填充
		shadow[row][col] = 7; // 表示已被填充
		flood_fill(row+1, col, color);
		flood_fill(row-1, col, color);
		flood_fill(row, col+1, color);
		flood_fill(row, col-1, color);
	}
}

/**
 * 坐标周围4交叉点有气否。
 * 
 */
export function have_air(pan, row, col) {
	if (row > 0 && row < 19-1 && col > 0 && row < 19-1) { //非边角 1->17(0->18)
		if (	pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			//alert("have no air");
			return false;
		} else {
			//alert("have air");
			return true;
		}
	} else if (row === 0 && col > 0 && col < 19-1) { // 边
		if (	pan[row+1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			//alert("have no air");
			return false;
		} else {
			//alert("have air");
			return true;
		}
	} else if (row === 19-1 && col > 0 && col < 19-1) {
		if (	pan[row-1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 0 && row > 0 && row < 19-1) {
		if (	pan[row][col+1] !== 0 &&
				pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 19-1 && row > 0 && row < 19-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 0) { // 角
		if (	pan[row][col+1] !== 0 &&
				pan[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 19-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 19-1 && col === 0) {
		if (	pan[row][col+1] !== 0 &&
				pan[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 19-1 && col === 19-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	}
}

/**
 *
 * 坐标周围是否有我方的棋子
 * 
 * 
 */
export function have_my_people(pan, row, col) { //FIXME 边角没有处理呢
	if (row > 0 && row < 19-1 && col > 0 && row < 19-1) { //非边角 1->17(0->18)
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row+1][col] === color_black ||
					pan[row-1][col] === color_black ||
					pan[row][col+1] === color_black ||
					pan[row][col-1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === -1 ||
					pan[row-1][col] === -1 ||
					pan[row][col+1] === -1 ||
					pan[row][col-1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col > 0 && col < 19-1) { // 边
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row+1][col] === color_black ||
					pan[row][col+1] === color_black ||
					pan[row][col-1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === -1 ||
					pan[row][col+1] === -1 ||
					pan[row][col-1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 19-1 && col > 0 && col < 19-1) { // 边
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row-1][col] === color_black ||
					pan[row][col+1] === color_black ||
					pan[row][col-1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === -1 ||
					pan[row][col+1] === -1 ||
					pan[row][col-1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (col === 19-1 && row > 0 && row < 19-1) {
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row+1][col] === color_black ||
					pan[row-1][col] === color_black ||
					pan[row][col-1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === -1 ||
					pan[row-1][col] === -1 ||
					pan[row][col-1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (col === 0 && row > 0 && row < 19-1) {
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row+1][col] === color_black ||
					pan[row-1][col] === color_black ||
					pan[row][col+1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === -1 ||
					pan[row-1][col] === -1 ||
					pan[row][col+1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col === 0) { // 角
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row+1][col] === color_black ||
					pan[row][col+1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === -1 ||
					pan[row][col+1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col === 19-1) { // 角
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row+1][col] === color_black ||
					pan[row][col-1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === -1 ||
					pan[row][col-1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 19-1 && col === 0) { // 角
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row-1][col] === color_black ||
					pan[row][col+1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === -1 ||
					pan[row][col+1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 19-1 && col === 19-1) { // 角
		if (move_count % 2 !== 0) { //未落子前是白
			if (	pan[row-1][col] === color_black ||
					pan[row][col-1] === color_black ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === -1 ||
					pan[row][col-1] === -1 ) {
				//alert("have my people");
				return true;
			}
		}
	}

	return false;
}

// 真正落子
function stone_down(pan, row, col) {
	if (move_count % 2 !== 0) { //未落子前是白
		pan[row][col] = color_black; //就放黑
	} else {
		pan[row][col] = color_white;
	}
	move_count ++;
	move_record.push([row, col, move_count]);	// 记录手数
}


export {stone_down }
