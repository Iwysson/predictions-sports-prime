"use client";

import { FormEvent, useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type SavedComment = { id: number; text: string; createdAt: string };

type CommentCopy = {
  title: string; note: string; placeholder: string; aria: string; save: string; add: string; edit: string; remove: string; empty: string;
};

const copy: Record<string, CommentCopy> = {
  en: { title: "Your personal comment", note: "This private note is stored only in this browser.", placeholder: "Write your comment about this analysis", aria: "New comment", save: "Save", add: "Add note", edit: "Edit", remove: "Delete", empty: "No personal note for this match." },
  "pt-BR": { title: "Seu comentário pessoal", note: "Esta nota é privada e fica salva somente neste navegador.", placeholder: "Escreva seu comentário sobre esta análise", aria: "Novo comentário", save: "Salvar", add: "Adicionar nota", edit: "Editar", remove: "Excluir", empty: "Nenhuma nota pessoal para este jogo." },
  es: { title: "Tu comentario personal", note: "Esta nota es privada y se guarda solo en este navegador.", placeholder: "Escribe tu comentario sobre este análisis", aria: "Nuevo comentario", save: "Guardar", add: "Añadir nota", edit: "Editar", remove: "Eliminar", empty: "No hay notas personales para este partido." },
  it: { title: "Il tuo commento personale", note: "Questa nota è privata e viene salvata solo in questo browser.", placeholder: "Scrivi un commento su questa analisi", aria: "Nuovo commento", save: "Salva", add: "Aggiungi nota", edit: "Modifica", remove: "Elimina", empty: "Nessuna nota personale per questa partita." },
  fr: { title: "Votre commentaire personnel", note: "Cette note est privée et enregistrée uniquement dans ce navigateur.", placeholder: "Écrivez votre commentaire sur cette analyse", aria: "Nouveau commentaire", save: "Enregistrer", add: "Ajouter une note", edit: "Modifier", remove: "Supprimer", empty: "Aucune note personnelle pour ce match." },
  de: { title: "Ihr persönlicher Kommentar", note: "Diese private Notiz wird nur in diesem Browser gespeichert.", placeholder: "Kommentar zu dieser Analyse schreiben", aria: "Neuer Kommentar", save: "Speichern", add: "Notiz hinzufügen", edit: "Bearbeiten", remove: "Löschen", empty: "Keine persönliche Notiz zu diesem Spiel." },
  nl: { title: "Uw persoonlijke opmerking", note: "Deze privénotitie wordt alleen in deze browser opgeslagen.", placeholder: "Schrijf uw opmerking over deze analyse", aria: "Nieuwe opmerking", save: "Opslaan", add: "Notitie toevoegen", edit: "Bewerken", remove: "Verwijderen", empty: "Geen persoonlijke notitie voor deze wedstrijd." },
  tr: { title: "Kişisel yorumunuz", note: "Bu özel not yalnızca bu tarayıcıda saklanır.", placeholder: "Bu analiz hakkındaki yorumunuzu yazın", aria: "Yeni yorum", save: "Kaydet", add: "Not ekle", edit: "Düzenle", remove: "Sil", empty: "Bu maç için kişisel not yok." },
};

export function MatchComments({ matchSlug }: { matchSlug: string }) {
  const { locale } = useI18n();
  const labels = copy[locale] ?? copy.en;
  const [comments, setComments] = useState<SavedComment[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const storageKey = `psp-comments-${matchSlug}`;

  useEffect(() => {
    try { setComments(JSON.parse(localStorage.getItem(storageKey) ?? "[]")); }
    catch { setComments([]); }
  }, [storageKey]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    const next = editingId === null
      ? [...comments, { id: Date.now(), text: clean, createdAt: new Date().toISOString() }]
      : comments.map((comment) => comment.id === editingId ? { ...comment, text: clean } : comment);
    setComments(next); setText(""); setEditingId(null);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  function edit(comment: SavedComment) { setEditingId(comment.id); setText(comment.text); }
  function remove(id: number) {
    const next = comments.filter((comment) => comment.id !== id);
    setComments(next);
    if (editingId === id) { setEditingId(null); setText(""); }
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  return (
    <section className="match-comments" aria-labelledby="comments-title">
      <h2 id="comments-title">{labels.title}</h2>
      <small>{labels.note}</small>
      <form onSubmit={submit}>
        <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={500} placeholder={labels.placeholder} aria-label={labels.aria} />
        <button className="button button--small" type="submit">{editingId !== null ? labels.save : labels.add}</button>
      </form>
      {comments.length > 0 ? (
        <div className="comment-list">
          {comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <p>{comment.text}</p>
              <div><button type="button" onClick={() => edit(comment)}>{labels.edit}</button><button type="button" onClick={() => remove(comment.id)}>{labels.remove}</button></div>
            </div>
          ))}
        </div>
      ) : <small>{labels.empty}</small>}
    </section>
  );
}
