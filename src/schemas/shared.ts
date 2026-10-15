import { z } from "zod";

export const MAX_INTEGER = 2_147_483_647;

export const idSchema = z.coerce.number().int().positive().max(MAX_INTEGER);
