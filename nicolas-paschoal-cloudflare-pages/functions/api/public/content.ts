import initialState from "../../../content/initial-state.json";

export const onRequestGet: PagesFunction = async ({ env }) => {
  const saved = await (env as any).BUCKET.get("cms/state.json");
  const state = saved ? await saved.json() : initialState;
  return new Response(JSON.stringify({ published: state.published }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};
