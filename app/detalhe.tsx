import { useCallback, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { runMigrations } from '../src/database/database';
import {
  deleteSerie,
  getSerieById,
  toggleSerieConcluida,
} from '../src/database/serieRepository';
import type { Serie } from '../src/types/serie';

export default function DetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = Array.isArray(id) ? id[0] : id;
  const [serie, setSerie] = useState<Serie | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregarSerie = useCallback(async () => {
    if (!serieId) {
      router.back();
      return;
    }

    setCarregando(true);

    try {
      await runMigrations();
      const serieEncontrada = await getSerieById(Number(serieId));

      if (!serieEncontrada) {
        Alert.alert('Série não encontrada', 'Não foi possível carregar esta série.');
        router.back();
        return;
      }

      setSerie(serieEncontrada);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar a série.');
      router.back();
    } finally {
      setCarregando(false);
    }
  }, [router, serieId]);

  useFocusEffect(
    useCallback(() => {
      carregarSerie();
    }, [carregarSerie])
  );

  const alternarConclusao = async () => {
    if (!serie) {
      return;
    }

    try {
      await toggleSerieConcluida(serie.id);
      setSerie({ ...serie, concluida: !serie.concluida });
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status da série.');
    }
  };

  const confirmarExclusao = () => {
    if (!serie) {
      return;
    }

    Alert.alert(
      'Excluir série',
      `Deseja excluir "${serie.titulo}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSerie(serie.id);
              router.back();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a série.');
            }
          },
        },
      ]
    );
  };

  if (carregando || !serie) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <Text className="text-base text-slate-500">Carregando série...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-100 p-5">
      <View className="rounded-2xl bg-white p-5">
        <View className="mb-6 flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-slate-900">{serie.titulo}</Text>
            <Text className="mt-1 text-base text-slate-500">{serie.plataforma}</Text>
          </View>
          <Text
            className={`text-xs font-bold uppercase ${
              serie.concluida ? 'text-emerald-700' : 'text-amber-600'
            }`}
          >
            {serie.concluida ? 'Concluída' : 'Assistindo'}
          </Text>
        </View>

        <View className="gap-4 border-t border-slate-100 pt-5">
          <View className="flex-row justify-between">
            <Text className="text-slate-500">ID</Text>
            <Text className="font-semibold text-slate-800">{serie.id}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500">Temporadas</Text>
            <Text className="font-semibold text-slate-800">{serie.temporadas}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500">Episódios</Text>
            <Text className="font-semibold text-slate-800">{serie.episodios}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500">Nota</Text>
            <Text className="font-semibold text-slate-800">
              {serie.nota === null ? 'Sem nota' : `${serie.nota}/5`}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500">Criada em</Text>
            <Text className="font-semibold text-slate-800">{serie.createdAt}</Text>
          </View>
        </View>
      </View>

      <View className="mt-5 gap-3">
        <Pressable
          onPress={alternarConclusao}
          className={`items-center rounded-xl py-4 ${
            serie.concluida ? 'bg-amber-500' : 'bg-emerald-600'
          }`}
        >
          <Text className="font-bold text-white">
            {serie.concluida ? 'Voltar para assistindo' : 'Marcar como concluída'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push(`/form?id=${serie.id}`)}
          className="items-center rounded-xl bg-slate-800 py-4"
        >
          <Text className="font-bold text-white">Editar</Text>
        </Pressable>

        <Pressable
          onPress={confirmarExclusao}
          className="items-center rounded-xl border border-rose-200 bg-white py-4"
        >
          <Text className="font-bold text-rose-600">Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}
