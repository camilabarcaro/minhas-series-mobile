import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { runMigrations } from '../src/database/database';
import { getSeries } from '../src/database/serieRepository';
import type { Serie, SerieFilter } from '../src/types/serie';

export default function HomeScreen() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<SerieFilter>('todas');
  const [series, setSeries] = useState<Serie[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarSeries = useCallback(async () => {
    setCarregando(true);

    try {
      await runMigrations();
      setSeries(await getSeries(filtro));
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregarSeries();
    }, [carregarSeries])
  );

  const filtros: { label: string; value: SerieFilter }[] = [
    { label: 'Todas', value: 'todas' },
    { label: 'Assistindo', value: 'assistindo' },
    { label: 'Concluídas', value: 'concluidas' },
  ];

  return (
    <View className="flex-1 bg-slate-100 px-5 pt-4">
      <View className="mb-5 flex-row gap-2">
        {filtros.map((item) => {
          const ativo = filtro === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => setFiltro(item.value)}
              className={`rounded-full px-4 py-2 ${
                ativo ? 'bg-slate-900' : 'bg-white'
              }`}
            >
              <Text
                className={`font-semibold ${
                  ativo ? 'text-white' : 'text-slate-600'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={series}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-center text-base text-slate-500">
              {carregando ? 'Carregando séries...' : 'Nenhuma série encontrada.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/detalhe?id=${item.id}`)}
            className={`mb-3 rounded-2xl border p-4 ${
              item.concluida
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-white bg-white'
            }`}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-900">
                  {item.titulo}
                </Text>
                <Text className="mt-1 text-sm text-slate-500">
                  {item.plataforma}
                </Text>
              </View>
              <Text
                className={`text-xs font-bold uppercase ${
                  item.concluida ? 'text-emerald-700' : 'text-amber-600'
                }`}
              >
                {item.concluida ? 'Concluída' : 'Assistindo'}
              </Text>
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-sm text-slate-600">
                {item.temporadas} {item.temporadas === 1 ? 'temporada' : 'temporadas'}
                {' · '}
                {item.episodios} {item.episodios === 1 ? 'episódio' : 'episódios'}
              </Text>
              <Text className="text-sm font-semibold text-slate-700">
                {item.nota === null ? 'Sem nota' : `${item.nota}/10`}
              </Text>
            </View>
          </Pressable>
        )}
      />

      <Pressable
        onPress={() => router.push('/form')}
        className="absolute bottom-6 left-5 right-5 items-center rounded-xl bg-rose-500 py-4"
      >
        <Text className="text-base font-bold text-white">+ Nova série</Text>
      </Pressable>
    </View>
  );
}
