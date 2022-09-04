import { Router} from "express";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

function Person (name) {
    this.name = name;
    this.id = uuidv4();
}

const people = [new Person("Masha")];

router.get('/', (req, res) => {
    res.send(people);
})

router.post('/', (req, res) => {
    const newPerson = new Person(req.body.name);
    people.push(newPerson);
    res.send(newPerson);
})

router.put('/:id', (req, res) => {
    const personId = req.params.id;
    const updatedPersonIndex = people.findIndex(person => person.id === personId);
    people[updatedPersonIndex] = {...req.body, id: personId};
    res.send(people[updatedPersonIndex]);
})

router.delete('/:id', (req, res) => {
    const personId = req.params.id;
    const deletedPersonIndex = people.findIndex(person => person.id === personId);
    res.send(people.splice(deletedPersonIndex, 1)[0]);
})

export default router;