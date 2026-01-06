import queryString from "query-string";
import {
    TOutputFormat,
    TRecipe,
    TRecipeOutput,
    TRecipeSource,
    TRecipeTemplate,
} from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetRecipeTemplatesRequest,
    TGetRecipeTemplatesRawResponse,
    TGetRecipeTemplatesResponse,
    TRecipeTemplateRaw,
    TGetRecipesRequest,
    TGetRecipesRawResponse,
    TGetRecipesResponse,
    TCreateRecipeRequest,
    TCreateRecipeRequestRaw,
    TCreateRecipeResponse,
    TCreateRecipeRawResponse,
    TGetRecipeRequest,
    TGetRecipeResponse,
    TGetRecipeRawResponse,
    TUpdateRecipeRequest,
    TUpdateRecipeRequestRaw,
    TUpdateRecipeResponse,
    TUpdateRecipeRawResponse,
    TActivateRecipeRequest,
    TActivateRecipeResponse,
    TActivateRecipeRawResponse,
    TDeactivateRecipeRequest,
    TDeactivateRecipeResponse,
    TDeactivateRecipeRawResponse,
    TTriggerRecipeRequest,
    TTriggerRecipeResponse,
    TTriggerRecipeRawResponse,
    TRecipeRaw,
    TRecipeSourceRaw,
    TRecipeOutputRaw,
    TGetOutputFormatsRequest,
    TGetOutputFormatsRawResponse,
    TGetOutputFormatsResponse,
    TOutputFormatRaw,
} from "./types";

const { RECIPES } = CONFIG.API.DEFAULT.ROUTES;

const transformRecipeTemplate = (raw: TRecipeTemplateRaw): TRecipeTemplate => ({
    id: raw.id,
    name: raw.name,
    icon: raw.icon,
    description: raw.description,
    category: raw.category,
    author: raw.author,
    authorEmail: raw.author_email,
    isPublic: raw.is_public,
    isFeatured: raw.is_featured,
    usageCount: raw.usage_count,
    templateConfig: raw.template_config,
    previewImage: raw.preview_image,
    tags: raw.tags,
    created: raw.created,
    modified: raw.modified,
});

const transformRecipeSource = (raw: TRecipeSourceRaw): TRecipeSource => ({
    id: raw.id,
    sourceCategory: raw.source_category,
    filters: raw.filters,
    maxItems: raw.max_items,
    priorityScoreThreshold: raw.priority_score_threshold,
    created: raw.created,
    modified: raw.modified,
});

const transformRecipeOutput = (raw: TRecipeOutputRaw): TRecipeOutput => ({
    id: raw.id,
    outputFormat: raw.output_format,
    outputFormatName: raw.output_format_name,
    promptTemplate: raw.prompt_template,
    promptTemplateName: raw.prompt_template_name,
    userPromptOverride: raw.user_prompt_override,
    deliveryChannels: raw.delivery_channels,
    created: raw.created,
    modified: raw.modified,
});

const transformOutputFormat = (raw: TOutputFormatRaw): TOutputFormat => ({
    id: raw.id,
    type: raw.type,
    name: raw.name,
    description: raw.description,
    template: raw.template,
    costMultiplier: raw.cost_multiplier,
    isActive: raw.is_active,
    created: raw.created,
    modified: raw.modified,
});

const transformRecipe = (raw: TRecipeRaw): TRecipe => ({
    id: raw.id,
    user: raw.user,
    userEmail: raw.user_email,
    name: raw.name,
    icon: raw.icon,
    description: raw.description,
    isActive: raw.is_active,
    schedule: raw.schedule,
    lastRun: raw.last_run,
    timezone: raw.timezone,
    version: raw.version,
    recipeSources: raw.recipe_sources?.map(transformRecipeSource),
    recipeOutputs: raw.recipe_outputs?.map(transformRecipeOutput),
    created: raw.created,
    modified: raw.modified,
});

const recipesApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getRecipeTemplates: builder.query<
            TGetRecipeTemplatesResponse,
            TGetRecipeTemplatesRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const path = `${RECIPES.BASE}${RECIPES.TEMPLATES}?${params}`;
                Logger.debug("getRecipeTemplates: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetRecipeTemplatesRawResponse
            ): TGetRecipeTemplatesResponse => ({
                ...r,
                results: r.results.map(transformRecipeTemplate),
            }),
            keepUnusedDataFor: 0,
        }),
        getRecipes: builder.query<TGetRecipesResponse, TGetRecipesRequest>({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const path = `${RECIPES.BASE}${RECIPES.LIST}?${params}`;
                Logger.debug("getRecipes: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetRecipesRawResponse
            ): TGetRecipesResponse => ({
                ...r,
                results: r.results.map(transformRecipe),
            }),
            providesTags: ["Recipes"],
            keepUnusedDataFor: 0,
        }),
        getRecipe: builder.query<TGetRecipeResponse, TGetRecipeRequest>({
            query: (req) => {
                const path = `${RECIPES.BASE}${RECIPES.BY_ID(req.id)}`;
                Logger.debug("getRecipe: querying", path);
                return path;
            },
            transformResponse: (r: TGetRecipeRawResponse): TGetRecipeResponse =>
                transformRecipe(r),
            providesTags: ["Recipes"],
            keepUnusedDataFor: 0,
        }),
        createRecipe: builder.mutation<
            TCreateRecipeResponse,
            TCreateRecipeRequest
        >({
            query: (req: TCreateRecipeRequest) => {
                const body: TCreateRecipeRequestRaw = {
                    name: req.name,
                    description: req.description,
                    is_active: req.isActive,
                    schedule: req.schedule,
                    timezone: req.timezone,
                    sources: req.sources.map((s) => ({
                        source_category: s.sourceCategory,
                        filters: s.filters,
                        max_items: s.maxItems,
                        priority_score_threshold: s.priorityScoreThreshold,
                    })),
                    outputs: req.outputs.map((o) => ({
                        output_format: o.outputFormat,
                        prompt_template: o.promptTemplate,
                        user_prompt_override: o.userPromptOverride,
                        delivery_channels: o.deliveryChannels,
                    })),
                };
                const path = `${RECIPES.BASE}${RECIPES.LIST}`;
                Logger.debug("createRecipe: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body,
                };
            },
            transformResponse: (
                r: TCreateRecipeRawResponse
            ): TCreateRecipeResponse => transformRecipe(r),
            invalidatesTags: ["Recipes"],
        }),
        updateRecipe: builder.mutation<
            TUpdateRecipeResponse,
            TUpdateRecipeRequest
        >({
            query: (req: TUpdateRecipeRequest) => {
                const { id, ...rest } = req;
                const body: TUpdateRecipeRequestRaw = {
                    name: rest.name,
                    description: rest.description,
                    is_active: rest.isActive,
                    schedule: rest.schedule,
                    timezone: rest.timezone,
                    sources: rest.sources.map((s) => ({
                        source_category: s.sourceCategory,
                        filters: s.filters,
                        max_items: s.maxItems,
                        priority_score_threshold: s.priorityScoreThreshold,
                    })),
                    outputs: rest.outputs.map((o) => ({
                        output_format: o.outputFormat,
                        prompt_template: o.promptTemplate,
                        user_prompt_override: o.userPromptOverride,
                        delivery_channels: o.deliveryChannels,
                    })),
                };
                const path = `${RECIPES.BASE}${RECIPES.BY_ID(id)}`;
                Logger.debug("updateRecipe: querying", path);
                return {
                    url: path,
                    method: "PUT",
                    body,
                };
            },
            transformResponse: (
                r: TUpdateRecipeRawResponse
            ): TUpdateRecipeResponse => transformRecipe(r),
            invalidatesTags: ["Recipes"],
        }),
        activateRecipe: builder.mutation<
            TActivateRecipeResponse,
            TActivateRecipeRequest
        >({
            query: (req: TActivateRecipeRequest) => {
                const path = `${RECIPES.BASE}${RECIPES.ACTIVATE(req.id)}`;
                Logger.debug("activateRecipe: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
            transformResponse: (
                r: TActivateRecipeRawResponse
            ): TActivateRecipeResponse => transformRecipe(r),
            invalidatesTags: ["Recipes"],
        }),
        deactivateRecipe: builder.mutation<
            TDeactivateRecipeResponse,
            TDeactivateRecipeRequest
        >({
            query: (req: TDeactivateRecipeRequest) => {
                const path = `${RECIPES.BASE}${RECIPES.DEACTIVATE(req.id)}`;
                Logger.debug("deactivateRecipe: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
            transformResponse: (
                r: TDeactivateRecipeRawResponse
            ): TDeactivateRecipeResponse => transformRecipe(r),
            invalidatesTags: ["Recipes"],
        }),
        triggerRecipe: builder.mutation<
            TTriggerRecipeResponse,
            TTriggerRecipeRequest
        >({
            query: (req: TTriggerRecipeRequest) => {
                const path = `${RECIPES.BASE}${RECIPES.TRIGGER(req.id)}`;
                Logger.debug("triggerRecipe: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: {},
                };
            },
            transformResponse: (
                r: TTriggerRecipeRawResponse
            ): TTriggerRecipeResponse => transformRecipe(r),
            invalidatesTags: ["Recipes"],
        }),
        getOutputFormats: builder.query<
            TGetOutputFormatsResponse,
            TGetOutputFormatsRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const path = `${RECIPES.BASE}${RECIPES.OUTPUT_FORMATS}?${params}`;
                Logger.debug("getOutputFormats: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetOutputFormatsRawResponse
            ): TGetOutputFormatsResponse => ({
                ...r,
                results: r.results.map(transformOutputFormat),
            }),
            keepUnusedDataFor: 300,
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetRecipeTemplatesQuery,
    useGetRecipesQuery,
    useGetRecipeQuery,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useActivateRecipeMutation,
    useDeactivateRecipeMutation,
    useTriggerRecipeMutation,
    useGetOutputFormatsQuery,
} = recipesApi;
