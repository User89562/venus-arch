import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { DialogData } from "./dialog-form-data";
import { FormsModule } from "@angular/forms";
import { MaterialComponments } from "../modules/material-components.module";

@Component({
  selector: "app-dialog-form",
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialComponments],
  templateUrl: "./dialog-form.component.html",
  styleUrl: "./dialog-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFormComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
