type ZipFile = `${string}.zip`
type CssFile = `${string}.css`
type LiquidFile = `${string}.liquid`
export type FileName = ZipFile | CssFile | LiquidFile;
export type ParentFolder = 'assets' | 'templates' | 'layout' | 'snippets' | 'sections' | 'config';


export interface CallbackData {
    rutaBase: string,
    fileName: FileName
    stem: string
    parentFolder: ParentFolder
}

export const isValidFileName = (name: string): name is FileName => /\.(zip|css|liquid)$/.test(name);
