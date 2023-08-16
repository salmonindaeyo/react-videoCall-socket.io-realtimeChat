// เรียกใช้โมดูล 'express' และสร้างแอปพลิเคชัน
const app = require("express")();

// สร้างเซิร์ฟเวอร์ HTTP โดยใช้แอปพลิเคชันเป็นตัวกำหนดการประมวลผลคำขอ
const server = require("http").createServer(app);

// เรียกใช้โมดูล 'cors' เพื่อจัดการการตั้งค่า CORS (Cross-Origin Resource Sharing)
const cors = require("cors");

// สร้างวัตถุ socket.io และผูกกับเซิร์ฟเวอร์ที่สร้างไว้ พร้อมกำหนดค่า CORS
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
			// origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: ["ngrok-skip-browser-warning"]
	}
});

// เปิดการใช้งาน middleware CORS สำหรับแอปพลิเคชัน
app.use(cors());

// กำหนดพอร์ตที่แอปพลิเคชันจะทำงาน ถ้าไม่ได้ระบุจะใช้พอร์ต 5000
const PORT = process.env.PORT || 5000;

// กำหนดเส้นทางหลักของแอปพลิเคชันเพื่อส่งข้อความ 'Running' เมื่อมีคำขอ GET ถูกส่งไปที่ราก
app.get('/', (req, res) => {
	res.send('Running');
});


// จับเหตุการณ์การเชื่อมต่อ socket.io
io.on("connection", (socket) => {
	// ส่ง socket.id กลับไปยังตัวเอง
	socket.emit("me", socket.id);

socket.on('chatter', (message) => {
  console.log('chatter : ', message)
  io.emit('chatter', message)
})

	// จับเหตุการณ์การตัดการเชื่อมต่อ socket
	socket.on("disconnect", () => {
		// ส่งออกไปยัง socket ที่เชื่อมต่ออยู่ว่าการโทรสิ้นสุดลง
		socket.broadcast.emit("callEnded")
	});

	// จับเหตุการณ์การโทรถึงผู้ใช้
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		// ส่งออกไปยัง socket ที่กำหนดว่าจะโทรถึง พร้อมข้อมูลสัญญาณ
		console.log(signalData)
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	// จับเหตุการณ์การตอบรับการโทร
	socket.on("answerCall", (data) => {
		// ส่งออกไปยัง socket ที่ต้องการตอบรับ พร้อมข้อมูลสัญญาณ
		console.log(data)
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

// เริ่มเซิร์ฟเวอร์ที่พอร์ตที่กำหนดไว้
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
