import { Button } from "./ui/button"
import { Description } from "./ui/field"
import type { DropEvent } from "@react-types/shared"
import { DropZone } from "./ui/drop-zone"
import { FileContainer } from "./file-container"
import { FileTrigger } from "./ui/file-trigger"
import { IconGallery } from "@intentui/icons"
import { isFileDropItem } from "react-aria-components"
import { toast } from "sonner"
import { useFileUpload } from "../hooks/useFileUpload"
import { useState } from "react"

export const FileDrop = () => {
  const [droppedFile, setDroppedFile] = useState<File[] | undefined>(undefined)
  const uploadFile = useFileUpload()
  const onDropHandler = async (e: DropEvent) => {
    const item = e.items.filter(isFileDropItem)
    const files = await Promise.all(item.map((item) => item.getFile()))
    if (files) {
      if (droppedFile) {
        setDroppedFile([...droppedFile, ...files])
      } else {
        setDroppedFile(files)
      }
    }
  }

  const onSelectHandler = async (e: any) => {
    if (e) {
      const files = Array.from([...e])
      const item = files[0]

      if (item) {
        if (droppedFile) {
          setDroppedFile([...droppedFile, ...files])
        } else {
          setDroppedFile(files)
        }
      }
    }
  }
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <DropZone
        getDropOperation={(types) =>
          types.has("image/jpeg") || types.has("image/png") || types.has("application/pdf")
            ? "copy"
            : "cancel"
        }
        onDrop={onDropHandler}
        className={"min-h-[80%] w-full min-w-full"}
      >
        {droppedFile ? (
          <FileContainer
            files={droppedFile}
            onRemoveFile={(fileName) => {
              setDroppedFile((prev) => prev?.filter((prevFile) => prevFile.name !== fileName))
            }}
            formatFileSize={(bytes: number): string => {
              if (bytes >= 1048576) {
                // Convert to MB
                return `${(bytes / 1048576).toFixed(1)} MB`
              }
              if (bytes >= 1024) {
                // Convert to KB
                return `${(bytes / 1024).toFixed(1)} KB`
              }
              // Display in bytes if less than 1 KB
              return `${bytes} Bytes`
            }}
          />
        ) : (
          <div className="grid space-y-3">
            <div className="mx-auto grid size-12 place-content-center rounded-full border bg-secondary/70 group-data-[drop-target]:border-primary/70 group-data-[drop-target]:bg-primary/20">
              <IconGallery className="size-5" />
            </div>
            <div className="flex justify-center">
              <FileTrigger
                acceptedFileTypes={["image/png", "image/jpeg", "application/pdf"]}
                allowsMultiple={false}
                onSelect={onSelectHandler}
              >
                Upload a file
              </FileTrigger>
            </div>
            <Description>Or drag and drop PNG, JPG, GIF or PDFs up to 10MB</Description>
          </div>
        )}
        {/* <input type="hidden" name="image" value={droppedFile} /> */}
      </DropZone>
      <Button
        onPress={() => {
          if (droppedFile) {
            uploadFile.mutate(droppedFile, {
              onSuccess: (data, variables, ctx) => {
                if (data.sucess) {
                  toast.success(`${variables.length} Files uploaded successfully.`)
                } else {
                  toast.error("Files couldn't be uploaded.")
                }
              },
            })
          }
        }}
      >
        Upload
      </Button>
    </div>
  )
}
