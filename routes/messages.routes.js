import { Router} from "express";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

function Message (text, username) {
    this.text = text;
    this.username = username;
    this.id = uuidv4();
}

const messages = [new Message("Hello", "Masha18")];

router.get('/', (req, res) => {
    res.send(messages);
})

router.post('/', (req, res) => {
    const newMessage = new Message(req.body.text, req.body.username);
    messages.push(newMessage);
    res.send(newMessage);
})

router.put('/:id', (req, res) => {
    const messageId = req.params.id;
    const updatedMessageIndex = messages.findIndex(message => message.id === messageId);
    messages[updatedMessageIndex] = {...req.body, id: messageId};
    res.send(messages[updatedMessageIndex]);
})

router.delete('/:id', (req, res) => {
    const messageId = req.params.id;
    const deletedMessageIndex = messages.findIndex(message => message.id === messageId);
    res.send(messages.splice(deletedMessageIndex, 1)[0]);
})

export default router;