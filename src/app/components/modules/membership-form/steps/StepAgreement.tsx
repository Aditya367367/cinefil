import React from "react";
import { ChevronLeft, ChevronRight, Check, Upload, Printer } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { SkipTestingButton } from "../components/SkipTestingButton";

export function StepAgreement() {
  const {
    agreementAccepted, setAgreementAccepted,
    digitalSignature, setDigitalSignature,
    signaturePlace, setSignaturePlace,
    signatureDate, setSignatureDate,
    agreementSigningOption, setAgreementSigningOption,
    agreementSignedDocument, setAgreementSignedDocument,
    existingAgreementSignedDocumentUrl,
    passportPhoto, setPassportPhoto,
    passportPhoto2, setPassportPhoto2,
    existingPassportPhotoUrl, setExistingPassportPhotoUrl,
    existingPassportPhoto2Url, setExistingPassportPhoto2Url,
    documentErrors, setDocumentErrors,
    validateDocument,
    nextStep, prevStep,
    isProducer,
  } = useMembershipForm();

  const handleAgreementSignedDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) {
        setDocumentErrors(prev => ({ ...prev, agreementSignedDocument: error }));
        setAgreementSignedDocument(null);
      } else {
        setDocumentErrors(prev => ({ ...prev, agreementSignedDocument: '' }));
        setAgreementSignedDocument(file);
      }
    }
  };

  const handlePassportPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) {
        setDocumentErrors(prev => ({ ...prev, passportPhoto: error }));
        setPassportPhoto(null);
      } else {
        setDocumentErrors(prev => ({ ...prev, passportPhoto: '' }));
        setPassportPhoto(file);
      }
    }
  };

  const handlePassportPhoto2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) {
        setDocumentErrors(prev => ({ ...prev, passportPhoto2: error }));
        setPassportPhoto2(null);
      } else {
        setDocumentErrors(prev => ({ ...prev, passportPhoto2: '' }));
        setPassportPhoto2(file);
      }
    }
  };

  const isScanOption = agreementSigningOption === "scan";

  const canProceed = agreementAccepted &&
    (isScanOption
      ? Boolean(agreementSignedDocument || existingAgreementSignedDocumentUrl)
      : digitalSignature.trim()) &&
    signaturePlace.trim() &&
    signatureDate;

  return (
    <div className="mf-step">
      <div className="mf-step__header">
        <h3 className="mf-step__title flex items-center gap-2">
          Membership Agreement
          <abbr title="Sign the membership agreement digitally or upload a signed copy." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h3>
        <p className="mf-step__subtitle">Please read the membership agreement and choose your signing method.</p>
      </div>

      {/* Agreement content */}
      <div className="mf-agreement-scroll" id="printable-agreement">
        <div style={{ background: "rgba(16, 185, 129, 0.1)", borderLeft: "4px solid #10b981", padding: "12px", borderRadius: "4px", fontSize: "14px", fontWeight: "600", color: "#065f46", marginBottom: "16px" }}>
          Notice: CINEFIL will bear all expenses.
        </div>

        {isProducer ? (
          <>
            <p style={{ fontWeight: 700, marginBottom: "12px", textAlign: "center" }}>ANNEXURE A — AUTHORISATION AND LICENSING AGREEMENT FOR PRODUCER</p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              This Agreement is entered into on the date given in the Membership Form attached herein, which is part and parcel of the executed Annexure, BETWEEN CINEFIL Producers Performance Ltd, a company incorporated under the Companies Act, 2013, having its Administrative office at 21, Second Floor, Om Heera Panna Mall, Near Oshiwara Police Station, Jogeshwari (W), Mumbai – 400102, CIN U74999MH2018PLC315350 (“CINEFIL” / “the Society” / “Licensee” / First Part, including its successors and assigns) AND the Company / Firm / Banner / Individual named in the Membership Form, being the Author of Cinematograph Film / Producer / First Owner (“Licensor” / “Producer” / Second Part)
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              WHEREAS, the Licensor is the lawful Author, Producer and/or First Owner of the Cinematograph Film (Video) Works more particularly described in Exhibit 1; and WHEREAS, CINEFIL is a Copyright Society duly registered under Section 33(3) of the Copyright Act, 1957; NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties hereby agree as follows:
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>1.</strong> For the purposes of this Agreement, and as defined under Section 2(uu) of the Copyright Act, 1957, “Producer”, in relation to a cinematograph film, means a person who takes the initiative and responsibility for making the work; the said Producer is the Author of the Cinematograph Film pursuant to Section 2(d)(v) of the Copyright Act, 1957, and becomes a member of CINEFIL in the Author category as required under Chapter VII of the Copyright Act, 1957 read with Chapter XI of the Copyright Rules, 2013.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>2.</strong> That the said Producer / Author, being the Licensor herein, expressly reserves unto itself all broadcasting, satellite, cable, audio, electronic, digital, internet, streaming, OTT and other derivative or allied rights in the Works. The copyright, ownership and moral rights in the Works shall at all times remain solely vested in the Licensor, and nothing contained in this Agreement shall be construed as a transfer, assignment, licence or relinquishment of such rights or ownership, save and except the authorisation and licensing granted to CINEFIL for the administration and licensing of the Public Performance (Cinematograph Film – Video) Rights in accordance with the terms of this Agreement.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>3.</strong> Upon the Licensor applying for and being admitted as a member of CINEFIL, this Agreement shall operate as an authorisation in favour of CINEFIL pursuant to Chapter VII, Sections 33, 34 and 35 read with Section 30A of the Copyright Act, 1957 and Rules 54 and 55 of the Copyright Rules, 2013. Such authorisation shall take effect from the date of execution of this Agreement and shall authorise CINEFIL to administer, manage, license, enforce, collect licence fees, and distribute royalties in respect of the Public Performance (Cinematograph Film – Video) Rights in the Works, within India and internationally. Such authorisation shall continue for the subsistence of copyright in the Works, unless earlier withdrawn by the Licensor in accordance with Clause 4 hereof, and the Public Performance (Cinematograph Film – Video) Rights shall, during such period, be administered and licensed by CINEFIL for lawful exercise by its authorised licensees.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>4.</strong> The Licensor may, in accordance with Section 34(1)(b) of the Copyright Act, 1957 read with Rule 55 of the Copyright Rules, 2013, withdraw such authorisation by giving sixty (60) days’ prior written notice to CINEFIL and may also terminate or withdraw any related licensing arrangement, if any, in accordance with the terms thereof, without prejudice to any subsisting contracts and subject to the obligations of a member of a registered Copyright Society under the proviso to Section 33 and the other applicable provisions of the Copyright Act, 1957.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>5.</strong> Execution of this Agreement shall entitle the Licensor to enrolment as an Associate Member of CINEFIL. Admission as a Prime Member shall be an internal administrative process, subject to the Licensor furnishing, whenever required by CINEFIL for compliance, verification or statutory purposes, all prescribed supporting documents, including Censorship Certificates, unless exempted under the Company’s Policies or Bye-laws having regard to applicable law, prevailing trade practice or any other requirements prescribed under the Copyright Act, 1957 and the Copyright Rules, 2013. The Licensor hereby undertakes to furnish all such documents and information as may be required from time to time and acknowledges that entitlement to the distribution of royalties shall arise only upon admission as a Prime Member and completion of the prescribed compliance and verification process.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>6.</strong> The Licensor hereby confirms and declares that it shall promptly notify CINEFIL in writing of any change in the ownership, title or status of the rights in the Works. The Licensor further acknowledges and agrees that CINEFIL’s statutory compliance and verification process is continuous in nature, with each royalty distribution cycle constituting a compliance checkpoint. Accordingly, the Licensor shall, whenever required by CINEFIL, furnish such information, documents or evidence as may be necessary to establish its continuing entitlement to the rights in the Works and to facilitate compliance with the Copyright Act, 1957, the Copyright Rules, 2013 and the Company’s Bye-laws and Policies.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>7.</strong> The Party of the Second Part hereby confirms that, in consideration of the rights granted herein, CINEFIL has paid to the Licensor a token licence fee of Rs. 100/- (Rupees One Hundred only), the receipt and sufficiency whereof are hereby acknowledged. The balance consideration, if any, shall comprise the Licensor’s share of royalties distributable under CINEFIL’s approved Distribution Scheme, after deduction of the administrative expenses, non-administrative expenses and capital expenditure duly approved by the Governing Council, the Board of Directors and / or the General Body, as applicable, and shall be disclosed in the Annual Transparency Report in compliance with Rule 65A of the Copyright Rules, 2013 read with the Copyright Act, 1957, as amended from time to time.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>8.</strong> This Agreement is executed on a Non-Judicial Stamp Paper of Rs. 100/- attached hereto as Annexure B, and is governed by the provisions of the Delhi Stamp Act, 2007 or any other applicable stamp law. Any deficiency in stamp duty shall constitute a curable defect, the liability for which shall be borne jointly by the Parties, without affecting the validity or enforceability of this Agreement, subject to the applicable stamp laws. This Agreement may be executed physically, digitally or in counterparts, each of which constitutes an original, and a duly acknowledged copy furnished to the Licensor constitutes valid evidence of execution. This Agreement is governed by and construed in accordance with the laws of India, including the Copyright Act, 1957 and the Copyright Rules, 2013, and any dispute arising out of or in connection with this Agreement is subject to the exclusive jurisdiction of the competent courts at New Delhi.
            </p>
            <p style={{ marginTop: "20px", fontWeight: "bold" }}>IN WITNESS WHEREOF, the Parties have executed this Agreement on the date stated in the Membership Form.</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <div>
                <p><strong>For CINEFIL Producers Performance Limited</strong></p>
                <p style={{ marginTop: "24px" }}>Sattyam Raj<br />Executive Director</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p><strong>For Licensor / Producer</strong></p>
                <p style={{ marginTop: "24px" }}>Authorized Signatory</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 700, marginBottom: "12px", textAlign: "center" }}>ANNEXURE A — AUTHORISATION AND LICENSING AGREEMENT FOR OTHER OWNERS</p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              This Agreement is entered into on the date given in the Membership Form attached herein, which is part and parcel of the executed Annexure, BETWEEN CINEFIL Producers Performance Ltd, a company incorporated under the Companies Act, 2013, having its Administrative office at 21, Second Floor, Om Heera Panna Mall, Near Oshiwara Police Station, Jogeshwari (W), Mumbai – 400102, CIN U74999MH2018PLC315350 (“CINEFIL” / “the Society” / “Licensee” / First Part, including its successors and assigns) AND the Company / Firm / Banner / Individual named in the Membership Form, being the Other Owner / Video Publisher / holder of the Public Performance Rights of the Cinematograph Film (Video) Works (“Licensor” / “Other Owner” / Second Part),
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              WHEREAS, the Licensor is the lawful owner and / or authorised holder, as Other Owner, of the Public Performance (Cinematograph Film – Video) Rights in the Works more particularly described in Exhibit 1, and is entitled to exercise and authorise the exploitation thereof under the Copyright Act, 1957; and WHEREAS, CINEFIL is a Copyright Society duly registered under Section 33(3) of the Copyright Act, 1957; NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties hereby agree as follows:
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>1.</strong> For the purposes of this Agreement, “Other Owner” means, as per prevailing film trade practice, an individual or entity that has acquired the negative rights of the Cinematograph Film for video publishing, together with the master recordings, from the Producer or from another Other Owner, supported by link documents, Censor Certificates and related documents of title.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>2.</strong> That the said Other Owner, being the Licensor herein, expressly reserves unto itself all broadcasting, satellite, cable, audio, electronic, digital, internet, streaming, OTT and other derivative or allied rights in the Works, and all other rights, title and interests comprised in the bundle of copyright. The copyright and ownership rights in the Works, as held by the Licensor as Other Owner, shall at all times remain solely vested in the Licensor, and nothing contained in this Agreement shall be construed as a transfer, assignment, licence or relinquishment of such rights or ownership, save and except the authorisation and licensing granted to CINEFIL for the administration and licensing of the Public Performance (Cinematograph Film – Video) Rights in accordance with the terms of this Agreement.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>3.</strong> Upon the Licensor applying for and being admitted as a member of CINEFIL, this Agreement shall operate as an authorisation in favour of CINEFIL pursuant to Chapter VII, Sections 33, 34 and 35 read with Section 30A of the Copyright Act, 1957 and Rules 54 and 55 of the Copyright Rules, 2013. Such authorisation shall take effect from the date of execution of this Agreement and shall authorise CINEFIL to administer, manage, license, enforce, collect licence fees, and distribute royalties in respect of the Public Performance (Cinematograph Film – Video) Rights in the Works, within India and internationally. Such authorisation shall continue for the subsistence of the Licensor’s rights in the Works, unless earlier withdrawn by the Licensor in accordance with Clause 4 hereof, and the Public Performance (Cinematograph Film – Video) Rights shall, during such period, be administered and licensed by CINEFIL for lawful exercise by its authorised licensees.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>4.</strong> The Licensor may, in accordance with Section 34(1)(b) of the Copyright Act, 1957 read with Rule 55 of the Copyright Rules, 2013, withdraw such authorisation by giving sixty (60) days’ prior written notice to CINEFIL and may also terminate or withdraw any related licensing arrangement, if any, in accordance with the terms thereof, without prejudice to any subsisting contracts and subject to the obligations of a member of a registered Copyright Society under the proviso to Section 33 and the other applicable provisions of the Copyright Act, 1957.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>5.</strong> Execution of this Agreement shall entitle the Licensor to enrolment as an Associate Member of CINEFIL. Admission as a Prime Member shall be an internal administrative process, subject to the Licensor furnishing, whenever required by CINEFIL for compliance, verification or statutory purposes, all prescribed supporting documents, including the instruments of title, assignment deeds, agreements or other documents evidencing the Licensor’s rights as Other Owner in the Works, and Censorship Certificates, unless exempted under the Company’s Policies or Bye-laws having regard to applicable law, prevailing trade practice or any other requirements prescribed under the Copyright Act, 1957 and the Copyright Rules, 2013. The Licensor hereby undertakes to furnish all such documents and information as may be required from time to time and acknowledges that entitlement to the distribution of royalties shall arise only upon admission as a Prime Member and completion of the prescribed compliance and verification process.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>6.</strong> The Licensor hereby confirms and declares that it shall promptly notify CINEFIL in writing of any change in the ownership, title or status of the rights in the Works, including any expiry, termination, reversion or assignment of the instruments under which the Licensor holds such rights as Other Owner. The Licensor further acknowledges and agrees that CINEFIL’s statutory compliance and verification process is continuous in nature, with each royalty distribution cycle constituting a compliance checkpoint. Accordingly, the Licensor shall, whenever required by CINEFIL, furnish such information, documents or evidence as may be necessary to establish its continuing entitlement to the rights in the Works and to facilitate compliance with the Copyright Act, 1957, the Copyright Rules, 2013 and the Company’s Bye-laws and Policies.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>7.</strong> The Party of the Second Part hereby confirms that, in consideration of the rights granted herein, CINEFIL has paid to the Licensor a token licence fee of Rs. 100/- (Rupees One Hundred only), the receipt and sufficiency whereof are hereby acknowledged. The balance consideration, if any, shall comprise the Licensor’s share of royalties distributable under CINEFIL’s approved Distribution Scheme, after deduction of the administrative expenses, non-administrative expenses and capital expenditure duly approved by the Governing Council, the Board of Directors and / or the General Body, as applicable, and shall be disclosed in the Annual Transparency Report in compliance with Rule 65A of the Copyright Rules, 2013 read with the Copyright Act, 1957, as amended from time to time.
            </p>
            <p style={{ marginBottom: "12px", textAlign: "justify", lineHeight: "1.5" }}>
              <strong>8.</strong> This Agreement is executed on a Non-Judicial Stamp Paper of Rs. 100/- attached hereto as Annexure B, and is governed by the provisions of the Delhi Stamp Act, 2007 or any other applicable stamp law. Any deficiency in stamp duty shall constitute a curable defect, the liability for which shall be borne jointly by the Parties, without affecting the validity or enforceability of this Agreement, subject to the applicable stamp laws. This Agreement may be executed physically, digitally or in counterparts, each of which constitutes an original, and a duly acknowledged copy furnished to the Licensor constitutes valid evidence of execution. This Agreement is governed by and construed in accordance with the laws of India, including the Copyright Act, 1957 and the Copyright Rules, 2013, and any dispute arising out of or in connection with this Agreement is subject to the exclusive jurisdiction of the competent courts at New Delhi.
            </p>
            <p style={{ marginTop: "20px", fontWeight: "bold" }}>IN WITNESS WHEREOF, the Parties have executed this Agreement on the date stated in the Membership Form.</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <div>
                <p><strong>For CINEFIL Producers Performance Limited</strong></p>
                <p style={{ marginTop: "24px" }}>Sattyam Raj<br />Executive Director</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p><strong>For Licensor / Other Owner</strong></p>
                <p style={{ marginTop: "24px" }}>Authorized Signatory</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Acceptance */}
      <div
        className={`mf-check-card ${agreementAccepted ? "mf-check-card--checked" : ""}`}
        onClick={() => setAgreementAccepted(!agreementAccepted)}
        style={{ marginTop: "20px" }}
      >
        <div className="mf-check-card__box">
          {agreementAccepted && <Check size={12} color="#fff" strokeWidth={3} />}
        </div>
        <span className="mf-check-card__text" style={{ fontWeight: 600 }}>
          I have read and accepted the membership agreement.
        </span>
      </div>

      <hr className="mf-divider" />

      {/* Signing Option Selection */}
      <span className="mf-section-label">Signature Method</span>
      <div className="mf-radio-group" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {/* <div
          className={`mf-radio-card ${agreementSigningOption === "dsc" ? "mf-radio-card--selected" : ""}`}
          onClick={() => setAgreementSigningOption("dsc")}
          style={{ padding: "12px" }}
        >
          <div className="mf-radio-card__indicator" />
          <span className="mf-radio-card__label" style={{ fontSize: "13px" }}>Digitally Sign (Aadhar eSign / DSC)</span>
        </div> */}
        <div
          className={`mf-radio-card ${agreementSigningOption === "no_dsc" ? "mf-radio-card--selected" : ""}`}
          onClick={() => setAgreementSigningOption("no_dsc")}
          style={{ padding: "12px" }}
        >
          <div className="mf-radio-card__indicator" />
          <span className="mf-radio-card__label" style={{ fontSize: "13px" }}>Digitally Sign (without DSC)</span>
        </div>
        <div
          className={`mf-radio-card ${agreementSigningOption === "scan" ? "mf-radio-card--selected" : ""}`}
          onClick={() => setAgreementSigningOption("scan")}
          style={{ padding: "12px" }}
        >
          <div className="mf-radio-card__indicator" />
          <span className="mf-radio-card__label" style={{ fontSize: "13px" }}>Scan and Upload Signed Copy</span>
        </div>
      </div>

      {/* Conditional Fields based on choice */}
      <div className="mf-grid" style={{ gridTemplateColumns: "1fr" }}>
        {isScanOption ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "8px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyBetween: "space-between", gap: "12px" }}>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <p style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b", margin: 0 }}>Print Annexure Document</p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Print out this agreement, physically sign it, and upload the scanned copy below.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const printContent = document.getElementById("printable-agreement");
                  if (!printContent) {
                    window.print();
                    return;
                  }
                  const win = window.open("", "_blank");
                  if (win) {
                    win.document.write(`
                      <html>
                        <head>
                          <title>Annexure Agreement - CINEFIL</title>
                          <style>
                            body { font-family: sans-serif; padding: 30px; font-size: 13px; line-height: 1.6; color: #1e293b; }
                            h1, h2, h3, p { margin-bottom: 12px; }
                            @media print {
                              body { padding: 0; }
                            }
                          </style>
                        </head>
                        <body>
                          ${printContent.innerHTML}
                        </body>
                      </html>
                    `);
                    win.document.close();
                    win.focus();
                    win.print();
                    win.close();
                  }
                }}
                className="mf-btn"
                style={{ background: "#1e293b", color: "#ffffff", padding: "8px 16px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "6px", cursor: "pointer", border: "none", fontWeight: 600 }}
              >
                <Printer size={16} /> Print Annexure Document
              </button>
            </div>

            <div>
              <label className="mf-label">Signed Agreement Copy <span className="mf-label__req">*</span></label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleAgreementSignedDocumentUpload} className="mf-hidden-input" id="agreement-signed-doc" />
              <label htmlFor="agreement-signed-doc" className={`mf-upload ${agreementSignedDocument || existingAgreementSignedDocumentUrl ? "mf-upload--has-file" : ""}`}>
                {agreementSignedDocument ? (
                  <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{agreementSignedDocument.name}</span></>
                ) : existingAgreementSignedDocumentUrl ? (
                  <>
                    <Check size={18} style={{ color: "#059669" }} />
                    <span className="mf-upload__filename">Existing Agreement Uploaded</span>
                    <a href={`http://localhost:8000${existingAgreementSignedDocumentUrl.startsWith('/') ? '' : '/'}${existingAgreementSignedDocumentUrl.replace('http://localhost:8000', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                      View
                    </a>
                  </>
                ) : (
                  <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload signed copy</span><span className="mf-upload__hint">PDF or JPG, max 4MB</span></>
                )}
              </label>
              {documentErrors.agreementSignedDocument && <p className="mf-error">{documentErrors.agreementSignedDocument}</p>}
            </div>

            {/* <div>
              <label className="mf-label">Passport Photo <span className="mf-label__req">*</span></label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={handlePassportPhotoUpload} className="mf-hidden-input" id="passport-photo-1" />
              <label htmlFor="passport-photo-1" className={`mf-upload ${passportPhoto || existingPassportPhotoUrl ? "mf-upload--has-file" : ""}`}>
                {passportPhoto ? (
                  <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{passportPhoto.name}</span></>
                ) : existingPassportPhotoUrl ? (
                  <>
                    <Check size={18} style={{ color: "#059669" }} />
                    <span className="mf-upload__filename">Photo 1 Uploaded</span>
                    <a href={`http://localhost:8000${existingPassportPhotoUrl.startsWith('/') ? '' : '/'}${existingPassportPhotoUrl.replace('http://localhost:8000', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                      View
                    </a>
                  </>
                ) : (
                  <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload Photo 1</span><span className="mf-upload__hint">JPG/PNG, max 4MB</span></>
                )}
              </label>
              {documentErrors.passportPhoto && <p className="mf-error">{documentErrors.passportPhoto}</p>}
            </div> */}

            {/* <div>
              <label className="mf-label">Passport Photo 2 <span className="mf-label__req">*</span></label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={handlePassportPhoto2Upload} className="mf-hidden-input" id="passport-photo-2" />
              <label htmlFor="passport-photo-2" className={`mf-upload ${passportPhoto2 || existingPassportPhoto2Url ? "mf-upload--has-file" : ""}`}>
                {passportPhoto2 ? (
                  <><Check size={18} style={{ color: "#059669" }} /><span className="mf-upload__filename">{passportPhoto2.name}</span></>
                ) : existingPassportPhoto2Url ? (
                  <>
                    <Check size={18} style={{ color: "#059669" }} />
                    <span className="mf-upload__filename">Photo 2 Uploaded</span>
                    <a href={`http://localhost:8000${existingPassportPhoto2Url.startsWith('/') ? '' : '/'}${existingPassportPhoto2Url.replace('http://localhost:8000', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', marginLeft: 'auto', color: '#3b82f6', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                      View
                    </a>
                  </>
                ) : (
                  <><Upload size={20} className="mf-upload__icon" /><span className="mf-upload__text">Upload Photo 2</span><span className="mf-upload__hint">JPG/PNG, max 4MB</span></>
                )}
              </label>
              {documentErrors.passportPhoto2 && <p className="mf-error">{documentErrors.passportPhoto2}</p>}
            </div> */}
          </div>
        ) : (
          <div style={{ marginBottom: "16px" }}>
            <label className="mf-label">Full Name <span className="mf-label__req">*</span></label>
            <input value={digitalSignature} onChange={(e) => setDigitalSignature(e.target.value)} className="mf-input" placeholder="Your full legal name" />
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              Typing your name acts as your digital signature {agreementSigningOption === "dsc" ? "(with eSign/DSC authorization)" : "(without DSC authorization)"}.
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div>
            <label className="mf-label">Place <span className="mf-label__req">*</span></label>
            <input value={signaturePlace} onChange={(e) => setSignaturePlace(e.target.value)} className="mf-input" placeholder="e.g. Mumbai" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="mf-label" style={{ marginBottom: 0 }}>Date <span className="mf-label__req">*</span></label>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  setSignatureDate(`${year}-${month}-${day}`);
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, background: 'none', border: 'none', padding: 0 }}
              >
                Today
              </button>
            </div>
            <input
              type="date"
              value={signatureDate}
              min={(() => {
                const d = new Date();
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              })()}
              onChange={(e) => setSignatureDate(e.target.value)}
              className="mf-input"
            />
          </div>
        </div>
      </div>

      <div className="mf-actions">
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <SkipTestingButton />
          <button type="button" onClick={nextStep} disabled={!canProceed} className="mf-btn mf-btn--next">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
