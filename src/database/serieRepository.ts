import { getDatabase } from './database';
import type {
  CreateSerieInput,
  Serie,
  SerieFilter,
  UpdateSerieInput,
} from '../types/serie';

type SerieRow = Omit<Serie, 'concluida'> & {
  concluida: number;
};

function mapSerie(row: SerieRow): Serie {
  return {
    ...row,
    concluida: Boolean(row.concluida),
  };
}

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = getDatabase();
  let rows: SerieRow[];

  if (filtro === 'assistindo') {
    rows = await db.getAllAsync<SerieRow>(
      'SELECT id, titulo, plataforma, temporadas, episodios, nota, concluida, createdAt FROM series WHERE concluida = 0 ORDER BY createdAt DESC, id DESC'
    );
  } else if (filtro === 'concluidas') {
    rows = await db.getAllAsync<SerieRow>(
      'SELECT id, titulo, plataforma, temporadas, episodios, nota, concluida, createdAt FROM series WHERE concluida = 1 ORDER BY createdAt DESC, id DESC'
    );
  } else {
    rows = await db.getAllAsync<SerieRow>(
      'SELECT id, titulo, plataforma, temporadas, episodios, nota, concluida, createdAt FROM series ORDER BY createdAt DESC, id DESC'
    );
  }

  return rows.map(mapSerie);
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync<SerieRow>(
    'SELECT id, titulo, plataforma, temporadas, episodios, nota, concluida, createdAt FROM series WHERE id = ?',
    id
  );

  return row ? mapSerie(row) : null;
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO series (titulo, plataforma, temporadas, episodios, nota) VALUES (?, ?, ?, ?, ?)',
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.episodios,
    input.nota
  );

  const serie = await getSerieById(Number(result.lastInsertRowId));
  if (!serie) {
    throw new Error('A série criada não foi encontrada.');
  }

  return serie;
}

export async function updateSerie(
  id: number,
  input: UpdateSerieInput
): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, episodios = ?, nota = ?, concluida = ? WHERE id = ?',
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.episodios,
    input.nota,
    input.concluida ? 1 : 0,
    id
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('UPDATE series SET concluida = NOT concluida WHERE id = ?', id);
}

export async function deleteSerie(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM series WHERE id = ?', id);
}
