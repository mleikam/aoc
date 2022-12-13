const { readInput } = require('../readInput')
require('../polyfill')

const hex2bin = hex => hex.split('').map(i => parseInt(i, 16).toString(2).padStart(4, '0')).join('');

let input = hex2bin(readInput('./input.txt'));

// input = '110100101111111000101000'
// input = '00111000000000000110111101000101001010010001001000000000'
// //       VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB
// input = '11101110000000001101010000001100100000100011000001100000'
// // VVVTTTILLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC
// input = hex2bin('8A004A801A8002F478')
// input = hex2bin('620080001611562C8802118E34')
// input = hex2bin('C0015000016115A2E0802F182340')
// input = hex2bin('A0016C880162017C3686B18A3D4780')
// input = hex2bin('C200B40A82')
// input = hex2bin('04005AC33890')
// input = hex2bin('880086C3E88112')
// input = hex2bin('CE00C43D881120')
// input = hex2bin('D8005AC2A8F0')
// input = hex2bin('F600BC2D8F')
// input = hex2bin('9C005AC2F8F0')
// input = hex2bin('9C0141080250320F1802104A08')

const bin2dec = bin => parseInt(bin,2);

const parseLiteral = s => {
	let binaryValue = '';
	let remainder = s;
	let last = false;
	while(true){
		if(remainder[0] === '0') last = true;
		binaryValue += remainder.slice(1,5);
		remainder = remainder.slice(5);
		if(last) break;
	};
	return {value: bin2dec(binaryValue), remainder };
};

const getOperator = typeId => {
	switch(typeId.toString()){
		case '0':
			return inputs => inputs.reduce((total,n) => total + n,0); // sum
		case '1':
			return inputs => inputs.reduce((total,n) => total * n,1); // multiply
		case '2':
			return inputs => inputs.reduce((z,n) => n < z ? n : z, Infinity); // min
		case '3':
			return inputs => inputs.reduce((z,n) => n > z ? n : z, 0); // max;
		case '4':
			return inputs => inputs[0]; // literal;
		case '5':
			return inputs => inputs[0] > inputs[1] ? 1 : 0; // greaterThan;
		case '6':
			return inputs => inputs[0] < inputs[1] ? 1 : 0; // lessThan;
		case '7':
			return inputs => inputs[0] === inputs[1] ? 1 : 0; // equalTo;
		default:
			throw new Error(`bad operator type: ${typeId}`);
			return null; 
	}
}

const getChildrenByEnumeration = (packetCount, remainder) => {
	const children = []
	for(let i =0;i<packetCount;i++){
		const parsed = parsePacket(remainder);
		children.push(parsed);
		remainder = parsed.remainder;
	}
	return { children, remainder }
}

const getChildrenByLength = (totalLength, remainder) => {
	let consumed = 0;
	const children = []; 
	while(consumed < totalLength){
		const parsed = parsePacket(remainder);
		children.push(parsed);
		consumed += remainder.length - parsed.remainder.length;
		remainder = parsed.remainder;
	}
	return { children, remainder }
}

const getOperatorChildren = packetData => {
	const lengthBit = packetData.slice(0,1);
	const data = packetData.slice(1);
	if(lengthBit === '1'){
		const packetCount = bin2dec(data.slice(0,11));
		const remainder = data.slice(11);
		return getChildrenByEnumeration(packetCount,remainder);
	} else {
		const totalLength = bin2dec(data.slice(0,15));
		const remainder = data.slice(15);
		return getChildrenByLength(totalLength,remainder);
	}
}

const parseOperator = (packetData, typeId) => {
	const { children, remainder } = getOperatorChildren(packetData);
	const value = getOperator(typeId)(children.map( child => child.value ));
	return { value, remainder }
}

let versionTotal = 0; // part 1

const parsePacket = packet => {
	const version = bin2dec(packet.slice(0,3));
	const typeId = bin2dec(packet.slice(3,6));
	const data = packet.slice(6)
	versionTotal += version; 
	const parser = typeId === 4 ? parseLiteral : parseOperator;
	const { value, remainder } = parser(data,typeId)
	return { version, typeId, value, remainder }
}

const output = parsePacket(input).value

console.log({versionTotal})
console.log({output}) // part 2
