export type GlobalStock = {
    
    BloodBagType: "blood" | "plaquette" | "plasma";
    BloodType: "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+" | "O-" | "O+";
    CountExpired : number; // Nombre de poches expirées
    CountExpiring : number; // Nombre de poches en cours d'expiration
    ReadyCount : number; // Nombre de poches prêtes
    MinStock : number; // Stock minimum requis
    CriticalStock : number; // Stock critique
}