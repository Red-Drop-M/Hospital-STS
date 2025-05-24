// src/api/donors.ts
import { Donor } from "@/components/Donors/columns";

const API_URL = "http://localhost:5000/donors"; // ou "http://localhost:3001/donors" pour JSON Server

export const getAllDonors = async (page: number = 1, pageSize: number = 10): Promise<{donors: Donor[], total: number}> => {
  const response = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error('Failed to fetch donors');
  }
  return response.json();
};

export const getDonorById = async (id: string): Promise<Donor> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch donor');
  }
  return response.json();
};

export const createDonor = async (donorData: Omit<Donor, 'id'>): Promise<Donor> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donorData),
  });
  if (!response.ok) {
    throw new Error('Failed to create donor');
  }
  return response.json();
};

export const updateDonor = async (id: string, donorData: Partial<Donor>): Promise<Donor> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donorData),
  });
  if (!response.ok) {
    throw new Error('Failed to update donor');
  }
  return response.json();
};

export const deleteDonor = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete donor');
  }
};