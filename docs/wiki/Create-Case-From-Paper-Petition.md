[Return to Directory](./README.md)

## Entering Paper petitions

* Petition can also be sent in via paper, Petitions clerk enters the data sent by petitioner
* Petition clerk enters date received (which becomes the Filed date) and they also enter the "mailed date" from the envelope (displays on cover sheet)
* All paper petitions get labeled with a Filed by time of midnight EST by default (only backend data point, not displayed in UI)

#### Parties tab
* Is default tab selected on load

**Party type**
* Required field
* On select, display contact fields depending on party type selected
* Party contact information is used to repopulate Case caption on Case Info tab
* If party contact information is edited on Parties tab, the autogenerated case caption updates as well

**Party type = Petitioner & Spouse**
* If Petitioner & Spouse is selected, display primary and secondary contact fields
* Display checkbox “Use same address & phone number as above for spouse information

**Use same address as above checkbox**
* On check, copy primary contact information to secondary contact form, including
    * Country
    * Mailing address line 1
    * Address line 2
    * Address line 3
    * City
    * State
    * Zip
    * Phone number
* Copied contact fields are editable
* If edit is made to primary contact field when checked, edit should copy to secondary contact form
* If edit is made to secondary (spouse) contact field when checked, edit should not copy to primary contact form

**Order for Corporate Disclosure Statement**
* If party type = Corporation, Partnership (as the Tax Matters Partner), Partnership (as a partnership representative under BBA regime), or Partnership (as a partner other than Tax Matters Partner) - check box is displayed and auto-checked
* If user uploads CDS PDF, checkbox is auto-unchecked

#### Case Info tab

**Date received**
* Required field

**Mailing date**
* Required field

**Case Caption**
* Is required
* if primary / secondary contact information has been entered on Parties tab, case caption field Is autogenerated and is editable
* if primary / secondary contact information has NOT been entered on Parties tab, case caption field is blank and editable  
* If party contact information is edited on Parties tab, the case caption updates as well
* If case caption field is manually edited on the Case Info tab, the party contact information is not updated

**Case procedure**
* Is required
* Default selection is Regular

**Order to Show Cause checkbox**
* Is optional
* Is always displayed

**Trial Location**
* Field is required IF an RQT PDF is uploaded; otherwise it’s optional
* If Regular case procedure is selected, the trial location dropdown displays the list of regular case locations
* If Small case procedure is selected, the trial location dropdown displays the list of small case locations

**Order for Place of Trial**
* If Trial Location field is blank = checkbox auto-checked
* If Trial Location is selected = checkbox is hidden

**Fee paid?**
* If Paid is selected, display Payment date (required) and Payment method (required)
* If Not Paid is selected, display “Order for Filing fee checkbox” = auto-checked
* If Waived is selected, display Date waived (required)

**Orders needed**
* Optional  

### IRS Notice

**IRS Notice provided**
* Is required
* No is selected as default
* If Yes is selected, display Type of Case (required) and Date of Notice (optional)
* If No is selected, display Type of Case (required)

**Type of Case**
* Field hidden until IRS Notice provided selection is made


#### Statistics
* Statistics fields display when "Yes" is selected for "IRS Notice provided?" and Deficiency is selected as case type

**Year or Period**
* Defaults to Year
* If "Period" is selected, display "Last date of period" field and hide "Year" field
* If "Year is selected, display "Year" field, and hide "Last date of period"

**Year**
* Numeric values only
* Max character = 4

**Last date of period**
* Date cannot be in the future
* If invalid date is entered on save, display error: "Enter a valid last date of period"

**Deficiency**
* required for first set
* numeric values only
* format for US currency during input = $XX,XXX.XX

**Total penalties**
* required for first set
* numeric values only
* format for US currency during input = $XX,XXX.XX

**Calculate Penalties**
* Petition clerk can enter up to 10 penalties, and on "Calculate", modal closes and the total will populate in the Total Penalties field
* If a clerk has manually entered a total penalties field, and then calculates, the calculated total will override the manual entry
* Clerks are able to manually edit a calculated total

**Add Another Year/Period**
* Clerks are able to add up to 12 year/period sets
* Sets 2-12 are optional UNLESS any field in a set includes data
* If any field in a set has data, then all fields in that set are required

#### Upload PDFs
* All PDFS other than the Petition can be removed before the Petition package is served to the IRS

**Petition**
* Is required

**STIN**
* Is optional for paper-filed petitions

**RQT**
* Is required IF Trial location field is selected
* Is optional IF Trial location field is blank

**CDS**
* Is required if party type = Corporation, Partnership (as the Tax Matters Partner), Partnership (as a partnership representative under BBA regime), or Partnership (as a partner other than Tax Matters Partner) AND Order for Corporate Disclosure Statement is unchecked
* If uploaded, Order for Corporate Disclosure Statement is auto-unchecked  

#### On click of Create Case button
* Case is created in system
* Docket number is assigned
* Petition document is entered onto the Docket Record (without service information)
* All other documents are not entered onto the Docket Record until service
* Case appears in the Petitions Section Document QC > In Progress tab
* App navigates to New Case : Review the Petition screen

#### Received Date and Filing Date
**Paper**
* When a court user is uploading a paper document, they're asked to put in a received date. That received date entered should be saved as both the received date and the filed date or lodged date, depending on what the user selects.
* Received date and filed date both show up on the cover sheet.
* If the user then edits the date on the docket record (this story), the filed date or lodged date updates on the backend and a new cover sheet is generated that has the original received date and the new filed or lodged date.

**Docket Record**
* date that shows on the docket record is the Filed Date (edited)
