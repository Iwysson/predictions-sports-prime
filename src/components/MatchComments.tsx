"use client";

import { FormEvent, useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type SavedComment = { id: number; text: string; createdAt: string };

export function MatchComments({ matchSlug }: { matchSlug: string }) {
  const { locale } = useI18n();
  const [comments, setComments] = useState<SavedComment[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const storageKey = `psp-comments-${matchSlug}`;
  const isPt = locale.toLowerCase().startsWith("pt");

  useEffect(() => {
    try {
      setComments(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    } catch {
      setComments([]);
    }
  }, [storageKey]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    const next = editingId === null
      ? [...comments, { id: Date.now(), text: clean, createdAt: new Date().toISOString() }]
      : comments.map((comment) => comment.id === editingId ? { ...comment, text: clean } : comment);
    setComments(next);
    setText("");
    setEditingId(null);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  function edit(comment: SavedComment) {
    setEditingId(comment.id);
    setText(comment.text);
  }

  function remove(id: number) {
    const next = comments.filter((comment) => comment.id !== id);
    setComments(next);
    if (editingId === id) { setEditingId(null); setText(""); }
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  return (
    <section className="match-comments" aria-labelledby="comments-title">
      <h2 id="comments-title">{isPt ? "Seu comentário pessoal" : "Your personal comment"}</h2>
      <small>{isPt ? "Esta nota é privada e fica salva somente neste navegador." : "This private note is stored only in this browser."}</small>
      <form onSubmit={submit}>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={500}
          placeholder={isPt ? "Escreva seu comentário sobre esta análise" : "Write your comment about this analysis"}
          aria-label={isPt ? "Novo comentário" : "New comment"}
        />
        <button className="button button--small" type="submit">
          {editingId !== null ? (isPt ? "Salvar" : "Save") : (isPt ? "Adicionar nota" : "Add note")}
        </button>
      </form>
      {comments.length > 0 ? (
        <div className="comment-list">
          {comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <p>{comment.text}</p>
              <div>
                <button type="button" onClick={() => edit(comment)}>{isPt ? "Editar" : "Edit"}</button>
                <button type="button" onClick={() => remove(comment.id)}>{isPt ? "Excluir" : "Delete"}</button>
              </div>
            </div>
          ))}
        </div>
      ) : <small>{isPt ? "Nenhuma nota pessoal para este jogo." : "No personal note for this match."}</small>}
    </section>
  );
}
