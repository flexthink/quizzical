import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faPlusSquare,
    faInfoCircle,
    faTrash,
    faEdit,
    faCheck,
    faTimes,
    faChalkboardTeacher,
    faGraduationCap,
    faHome,
    faQuestion
} from '@fortawesome/free-solid-svg-icons'

const icons = [
    faPlusSquare,
    faInfoCircle,
    faTrash,
    faEdit,
    faCheck,
    faTimes,
    faChalkboardTeacher,
    faGraduationCap,
    faHome,
    faQuestion
];

for (let icon of icons) {
    library.add(icon);
}
