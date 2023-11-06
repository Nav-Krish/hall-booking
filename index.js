const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())

const API_endpoints={
    "/createRoom": "to create a room",
    "/bookRoom": "to book a room",
    "/booedRooms": "to list all rooms with the booked data",
    "/bookedCustomers": "to list all customers with booked data",
    "/bookingHistory/:customer": "to list how many times a customer has booked the room"
}

app.get('/', (req, res) => {
    res.send(API_endpoints)
})

var rooms = []
var bookings = []

//API endpoint for- Creating a room
app.post('/createRoom', (req, res) => {
    const { roomName, noOfSeatsAvailable, amenities, pricePerHour } = req.body;
    const room = {
        id: rooms.length + 1,
        roomName,
        noOfSeatsAvailable,
        amenities,
        pricePerHour
    }
    rooms.push(room)
    res.send(`Room ${id} created successfully`)
})

//API endpoint for- booking a room
app.post('/bookRoom', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body

    //to check if the room is already booked for that particular date and time
    const booked = bookings.find((booking) => {
        date == booking.date &&
            roomId == booking.roomId &&
            startTime >= booking.startTime &&
            endTime <= booking.endTime
    })
    if (booked) {
        res.json({ error: "The room is not available at the requested date and time" })
    } else {
        const currentDate = new Date().toDateString()
        const check = rooms.find((room) => room.id == roomId)
        if (check) {
            const booking = {
                customerName,
                date,
                startTime,
                endTime,
                roomId,
                bookingStatus: "Booked",
                bookingId: bookings.length + 1,
                bookingDate: currentDate
            }
            bookings.push(booking)
            res.send("Room booked Successfully")
        } else {
            res.send("Requested room cannot be found")
        }
    }
})

//API endpoint to- list all rooms with the booked data
app.get('/bookedRooms', (req, res) => {
    const bookedRooms = rooms.map((room) => {
        const booked = bookings.filter((booking) => booking.roomId == room.id)

        var bookedData = booked.map((booking) => {
            return {
                customerName: booking.customerName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                bookingStatus: booking.bookingStatus
            }
        });
        return {
            roomName: room.roomName,
            bookings: bookedData
        }
    })
    res.json(bookedRooms)
})

//API endpoint to- list all customers with booked data
app.get('/bookedCustomers',(req,res)=>{
    const bookedCustomers=[]
    for (const booking of bookings) {
        const room = rooms.find((room) => room.id == booking.roomId);
    
        if (room) {
          const customerData = {
            customerName: booking.customerName,
            roomName: room.roomName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
          };
          bookedCustomers.push(customerData);
        }
      }
      res.json(bookedCustomers);
})

//API endpoint to- list how many times a customer has booked the room
app.get('/bookingHistory/:customer',(req,res)=>{
    const {name}=req.params
    const bookingHistory=bookings.filter((booking)=>booking.customerName==name)
    res.send(bookingHistory)
})

app.listen(PORT, () => {
    console.log("Server running on PORT:", PORT);
})
