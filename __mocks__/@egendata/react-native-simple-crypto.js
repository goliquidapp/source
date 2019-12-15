export const HMAC={
	hmac256:(payload, secret)=>new Promise((resolve, reject)=>resolve()),

}
export const utils={
	convertArrayBufferToHex:(buff)=>[],
	convertUtf8ToArrayBuffer:(utf8)=>new Buffer(''),
	convertArrayBufferToHex:(arr)=>0,
	convertArrayBufferToUtf8:(arr)=>'',
	convertArrayBufferToBase64:(arr)=>''
}
export const AES={
	encrypt:()=>'',
	decrypt:()=>''
}