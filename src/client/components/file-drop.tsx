import { Button } from "./ui/button"
import { Description } from "./ui/field"
import type { DropEvent } from "@react-types/shared"
import { DropZone } from "./ui/drop-zone"
import { FileTrigger } from "./ui/file-trigger"
import { IconFile } from "justd-icons"
import { IconGallery } from "@intentui/icons"
import { isFileDropItem } from "react-aria-components"
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
        setDroppedFile(files)
      }
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <DropZone
        getDropOperation={(types) =>
          types.has("image/jpeg") || types.has("image/png") || types.has("application/pdf")
            ? "copy"
            : "cancel"
        }
        onDrop={onDropHandler}
      >
        {droppedFile ? (
          // <img alt="" src={droppedFile} className="aspect-square size-full object-contain" />
          <div className="flex flex-row gap-2">
            {droppedFile.map((file) => (
              <div key={file.name} className="flex flex-col">
                <IconFile />
                <p>{`${file.name} (${file.size.toLocaleString("de")} kb)`}</p>
              </div>
            ))}
          </div>
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
            uploadFile.mutate(droppedFile)
          }
        }}
      >
        Upload
      </Button>
    </div>
  )
}
