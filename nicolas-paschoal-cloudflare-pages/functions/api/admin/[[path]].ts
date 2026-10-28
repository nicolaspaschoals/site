import { handle } from "../../_lib/cms-server";

export const onRequest: PagesFunction = ({ request, env }) => handle(request, env);
