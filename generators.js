/**
 * Returns a teseract of the given length
 * 
 * @param l Half the size of the edges
 */
function genTeseract(l=1, w=true) {
	// Manual creation

	let pts = [[-l, -l, -l, -l],
			   [-l,  l, -l, -l],
			   [-l,  l,  l, -l],
			   [-l, -l,  l, -l],
			   [-l, -l, -l, l],
			   [-l,  l, -l, l],
			   [-l,  l,  l, l],
			   [-l, -l,  l, l],
			   [l, -l, -l, -l],
			   [l,  l, -l, -l],
			   [l,  l,  l, -l],
			   [l, -l,  l, -l],
			   [l, -l, -l, l],
			   [l,  l, -l, l],
			   [l,  l,  l, l],
			   [l, -l,  l, l]];

	return new SolidObj(new Vector([0,0,0,0]), pts.map((p) => new Vector(p)),
			[  [0,1,2,3], [4,5,6,7], [8,9,10,11],[12,13,14,15],
			   [1,2,6,5], [1,2,10,9], [5,6,14,13], [13,14,10,9],
			   [0,3,7,4], [0,3,11,8], [8,11,15,12], [12,15,7,4],
			   [0,1,5,4], [4,5,13,12], [12,13,9,8], [8,9,1,0], [0,4,12,8], [1,5,13,9],
			   [2,3,7,6], [6,7,15,14], [10,11,15,14], [2,3,11,10], [2,6,14,10], [3,7,15,11]
			]
		);
}