import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

export interface Departement {
  idDepart?: number;
  nomDepart: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  // ✅ Utilise une URL relative pour activer le proxy Angular
  private baseUrl = '/kaddem/departement';

  constructor(private http: HttpClient) {}

  getAllDepartements(): Observable<Departement[]> {
    console.log('Tentative de connexion à :', `${this.baseUrl}/retrieve-all-departements`);
    return this.http.get<Departement[]>(`${this.baseUrl}/retrieve-all-departements`)
      .pipe(
        catchError(error => {
          console.error('Erreur backend:', error);
          throw error;
        })
      );
  }
}
