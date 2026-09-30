export type Serie = {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  episodios: number;
  nota: number | null;
  concluida: boolean;
  createdAt: string;
};

export type CreateSerieInput = Omit<Serie, 'id' | 'createdAt' | 'concluida'>;

export type UpdateSerieInput = Pick<
  Serie,
  'titulo' | 'plataforma' | 'temporadas' | 'episodios' | 'nota' | 'concluida'
>;

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';