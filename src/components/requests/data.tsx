// import {BloodRequest} from "./columns"

// export const bloodRequests: BloodRequest[] = [
//     {
//       requestId: "REQ001",
//       bloodType: "A+",
//       units: 2,
//       priority: "High",
//       status: "Pending",
//       doctor: "Dr. Ahmed Benali",
//       department: "Urgence"
//     },
//     {
//       requestId: "REQ002",
//       bloodType: "B-",
//       units: 1,
//       priority: "Medium",
//       status: "Approved",
//       doctor: "Dr. Lina Zerrouki",
//       department: "Chirurgie"
//     },
//     {
//       requestId: "REQ003",
//       bloodType: "O+",
//       units: 3,
//       priority: "High",
//       status: "Completed",
//       doctor: "Dr. Riad Hadj",
//       department: "Oncologie"
//     },
//     {
//       requestId: "REQ004",
//       bloodType: "AB-",
//       units: 2,
//       priority: "Low",
//       status: "Rejected",
//       doctor: "Dr. Nadia Mekki",
//       department: "Cardiologie"
//     },
//     {
//       requestId: "REQ005",
//       bloodType: "A-",
//       units: 4,
//       priority: "High",
//       status: "Pending",
//       doctor: "Dr. Karim Saidi",
//       department: "Traumatologie"
//     },
//     {
//       requestId: "REQ006",
//       bloodType: "O-",
//       units: 1,
//       priority: "Medium",
//       status: "Approved",
//       doctor: "Dr. Yasmine Boudiaf",
//       department: "Gynécologie"
//     },
//     {
//       requestId: "REQ007",
//       bloodType: "B+",
//       units: 3,
//       priority: "Low",
//       status: "Pending",
//       doctor: "Dr. Omar Larbi",
//       department: "Neurologie"
//     },
//     {
//       requestId: "REQ008",
//       bloodType: "A+",
//       units: 5,
//       priority: "High",
//       status: "Completed",
//       doctor: "Dr. Rania Touati",
//       department: "Urgence"
//     },
//     {
//       requestId: "REQ009",
//       bloodType: "AB+",
//       units: 2,
//       priority: "Medium",
//       status: "Rejected",
//       doctor: "Dr. Adel Khaled",
//       department: "Chirurgie"
//     },
//     {
//       requestId: "REQ010",
//       bloodType: "B-",
//       units: 1,
//       priority: "Low",
//       status: "Pending",
//       doctor: "Dr. Nabil Meziane",
//       department: "Néphrologie"
//     },
//     {
//       requestId: "REQ011",
//       bloodType: "O+",
//       units: 2,
//       priority: "Medium",
//       status: "Approved",
//       doctor: "Dr. Kamel Ziani",
//       department: "Pédiatrie"
//     },
//     {
//       requestId: "REQ012",
//       bloodType: "A-",
//       units: 3,
//       priority: "High",
//       status: "Completed",
//       doctor: "Dr. Imane Cherif",
//       department: "Urgence"
//     },
//     {
//       requestId: "REQ013",
//       bloodType: "O-",
//       units: 4,
//       priority: "High",
//       status: "Approved",
//       doctor: "Dr. Houari Bensalem",
//       department: "Chirurgie"
//     },
//     {
//       requestId: "REQ014",
//       bloodType: "AB-",
//       units: 2,
//       priority: "Medium",
//       status: "Rejected",
//       doctor: "Dr. Sara Bouzid",
//       department: "Oncologie"
//     },
//     {
//       requestId: "REQ015",
//       bloodType: "B+",
//       units: 1,
//       priority: "Low",
//       status: "Pending",
//       doctor: "Dr. Walid Gharbi",
//       department: "Cardiologie"
//     },
//     {
//       requestId: "REQ016",
//       bloodType: "A+",
//       units: 3,
//       priority: "Medium",
//       status: "Approved",
//       doctor: "Dr. Hind Mahrez",
//       department: "Gynécologie"
//     },
//     {
//       requestId: "REQ017",
//       bloodType: "O+",
//       units: 5,
//       priority: "High",
//       status: "Completed",
//       doctor: "Dr. Mourad Djemai",
//       department: "Traumatologie"
//     },
//     {
//       requestId: "REQ018",
//       bloodType: "B-",
//       units: 1,
//       priority: "Low",
//       status: "Rejected",
//       doctor: "Dr. Malek Nait",
//       department: "Néphrologie"
//     },
//     {
//       requestId: "REQ019",
//       bloodType: "AB+",
//       units: 2,
//       priority: "Medium",
//       status: "Pending",
//       doctor: "Dr. Yasmina Belaid",
//       department: "Pédiatrie"
//     },
//     {
//       requestId: "REQ020",
//       bloodType: "A-",
//       units: 3,
//       priority: "High",
//       status: "Approved",
//       doctor: "Dr. Amine Fekir",
//       department: "Neurologie"
//     },
//     {
//       requestId: "REQ021",
//       bloodType: "O-",
//       units: 2,
//       priority: "Medium",
//       status: "Completed",
//       doctor: "Dr. Djamila Kherfi",
//       department: "Urgence"
//     },
//     {
//       requestId: "REQ022",
//       bloodType: "B+",
//       units: 1,
//       priority: "Low",
//       status: "Pending",
//       doctor: "Dr. Tarek Belkacem",
//       department: "Chirurgie"
//     },
//     {
//       requestId: "REQ023",
//       bloodType: "A+",
//       units: 4,
//       priority: "High",
//       status: "Approved",
//       doctor: "Dr. Hichem Boukhalfa",
//       department: "Oncologie"
//     },
//     {
//       requestId: "REQ024",
//       bloodType: "AB-",
//       units: 2,
//       priority: "Medium",
//       status: "Rejected",
//       doctor: "Dr. Amina Soudani",
//       department: "Cardiologie"
//     },
//     {
//       requestId: "REQ025",
//       bloodType: "O+",
//       units: 3,
//       priority: "High",
//       status: "Pending",
//       doctor: "Dr. Karim Abid",
//       department: "Traumatologie"
//     },
//     {
//       requestId: "REQ026",
//       bloodType: "B-",
//       units: 2,
//       priority: "Low",
//       status: "Completed",
//       doctor: "Dr. Nassima Bekhti",
//       department: "Gynécologie"
//     },
//     {
//       requestId: "REQ027",
//       bloodType: "A-",
//       units: 1,
//       priority: "Medium",
//       status: "Approved",
//       doctor: "Dr. Othmane Kaci",
//       department: "Néphrologie"
//     },
//     {
//       requestId: "REQ028",
//       bloodType: "AB+",
//       units: 3,
//       priority: "High",
//       status: "Completed",
//       doctor: "Dr. Leila Menadi",
//       department: "Pédiatrie"
//     },
//     {
//       requestId: "REQ029",
//       bloodType: "O-",
//       units: 2,
//       priority: "Medium",
//       status: "Pending",
//       doctor: "Dr. Salim Bacha",
//       department: "Neurologie"
//     },
//     {
//       requestId: "REQ030",
//       bloodType: "B+",
//       units: 4,
//       priority: "Low",
//       status: "Rejected",
//       doctor: "Dr. Yacine Berchiche",
//       department: "Urgence"
//     },
//     {
//       requestId: "REQ031",
//       bloodType: "A+",
//       units: 2,
//       priority: "High",
//       status: "Approved",
//       doctor: "Dr. Sofia Tebbani",
//       department: "Oncologie"
//     }
//   ];
  