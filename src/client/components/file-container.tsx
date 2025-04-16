import { IconFile, IconX } from "@intentui/icons"

import { Button } from "./ui/button"

interface FileContainerProps {
  files: File[]
  onRemoveFile: (fileName: string) => void
  formatFileSize: (bytes: number) => string
}

export const FileContainer = ({ files, onRemoveFile, formatFileSize }: FileContainerProps) => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="group/file-card flex max-w-xs flex-col rounded-md border border-border p-4 hover:border-fg"
        >
          <div className="relative flex justify-between">
            <IconFile className="size-5" />
            <Button
              size="square-petite"
              intent="plain"
              onPress={() => onRemoveFile(file.name)}
              className="invisible group-hover/file-card:visible"
            >
              <IconX />
            </Button>
          </div>
          <p className="break-words">
            {file.name} <span className="text-muted-fg">({formatFileSize(file.size)})</span>
          </p>
        </div>
      ))}
    </div>
  )
}
