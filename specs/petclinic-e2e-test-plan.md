# Spring PetClinic End-to-End Test Plan

## Application Overview

End-to-end functional test plan for the Spring PetClinic application running at http://localhost:8080. Each test starts from a blank/fresh application state seeded by tests/seed.spec.ts and uses stable existing records or uniquely named test data. Coverage includes global navigation, owner search and pagination, owner and pet management, visit recording, veterinarian browsing, validation, and the intentional error endpoint.

## Test Scenarios

### 1. Global Navigation and Read-Only Views

**Seed:** `tests/seed.spec.ts`

#### 1.1. Load home page and use primary navigation

**File:** `tests/petclinic/global-navigation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:8080/.
    - expect: The page loads successfully with title "PetClinic :: a Spring Framework demonstration".
    - expect: A Welcome heading and VMware Tanzu logo are visible.
  2. Click Home, Find Owners, Veterinarians, and Error in separate fresh navigations.
    - expect: Each link navigates to its expected route: /, /owners/find, /vets.html, and /oups.
    - expect: The common navigation remains available on every page.

#### 1.2. Browse veterinarian directory and pagination

**File:** `tests/petclinic/veterinarians.spec.ts`

**Steps:**
  1. Open /vets.html.
    - expect: A Veterinarians heading and table with Name and Specialties columns are visible.
    - expect: The first page displays the seeded veterinarian records and their specialties, including records with none, one, and multiple specialties.
  2. Select page 2, then return to page 1 using the pagination controls.
    - expect: Page 2 displays a different set of veterinarian records.
    - expect: The active page indicator and enabled/disabled first, previous, next, and last controls reflect the current page.
    - expect: Returning to page 1 restores the first set of records without errors.

#### 1.3. Display intentional application error

**File:** `tests/petclinic/error-page.spec.ts`

**Steps:**
  1. Open /oups.
    - expect: The response is HTTP 500.
    - expect: The page displays "Something happened...", "An internal server error occurred.", and the expected controller-exception explanation.
    - expect: The page remains rendered with usable global navigation.

### 2. Owner Search and Profiles

**Seed:** `tests/seed.spec.ts`

#### 2.1. Search owners by last name and open profile

**File:** `tests/petclinic/owner-search.spec.ts`

**Steps:**
  1. Open Find Owners, enter "Franklin" in Last Name, and select Find Owner.
    - expect: The owner results page loads.
    - expect: George Franklin is listed with address, city, telephone, and pet data.
    - expect: No unrelated owner records are shown for the exact matching search.
  2. Open the George Franklin result.
    - expect: Owner Information shows the correct name, address, city, and telephone.
    - expect: Pets and Visits lists Leo with birth date 2010-09-07 and type cat.
    - expect: Edit Owner and Add New Pet actions are present.

#### 2.2. Search owners with blank, partial, and unknown terms

**File:** `tests/petclinic/owner-search-boundaries.spec.ts`

**Steps:**
  1. Submit the Find Owners form with an empty last-name field.
    - expect: The application returns the owner index rather than failing.
    - expect: Results are paginated and the first page contains the expected seeded records.
  2. Search using a partial last name such as "Dav".
    - expect: Matching Davis records are returned according to the application's search semantics.
    - expect: The result count and pagination remain consistent with the returned data.
  3. Search using a last name that does not exist, such as "NoSuchOwner".
    - expect: The page loads successfully with an empty-results state or equivalent no-match presentation.
    - expect: No stale records from a previous search appear.

#### 2.3. Navigate owner pagination

**File:** `tests/petclinic/owner-pagination.spec.ts`

**Steps:**
  1. Open the owner index with an empty search and select page 2.
    - expect: Page 2 shows the second set of seeded owners, including Jean Coleman through Carlos Estaban.
    - expect: Page 2 is marked active and the navigation controls reflect that it is the last page.
  2. Select page 1 and use the first/previous/next/last controls where enabled.
    - expect: Each control navigates to the correct page.
    - expect: Records do not duplicate or disappear during navigation.

### 3. Owner and Pet Management

**Seed:** `tests/seed.spec.ts`

#### 3.1. Create a new owner

**File:** `tests/petclinic/create-owner.spec.ts`

**Steps:**
  1. Open Add Owner and submit a unique valid owner with first name, last name, address, city, and a 10-digit telephone number.
    - expect: The owner is saved without validation errors.
    - expect: The application navigates to or displays the new owner's profile.
    - expect: The profile shows all submitted values and initially has no pets unless otherwise expected by the application.
  2. Search for the new owner's last name.
    - expect: The new owner appears in search results with the submitted contact information.

#### 3.2. Edit an existing owner

**File:** `tests/petclinic/edit-owner.spec.ts`

**Steps:**
  1. Open a seeded owner profile and select Edit Owner.
    - expect: The form is pre-populated with the owner's current values.
    - expect: The button is labeled Update Owner.
  2. Change the address, city, and telephone to valid new values and submit.
    - expect: The update succeeds without validation errors.
    - expect: The profile displays the changed values and preserves the owner identity and existing pets.

#### 3.3. Add and edit a pet

**File:** `tests/petclinic/pet-management.spec.ts`

**Steps:**
  1. From an owner profile, select Add New Pet and submit a unique pet name, a valid birth date, and each supported type in separate data-driven runs: bird, cat, dog, hamster, lizard, and snake.
    - expect: Each valid pet is saved under the selected owner.
    - expect: The owner profile displays the pet with the correct name, birth date, and type.
    - expect: The type control accepts only the six supported options and defaults to bird on a blank new-pet form.
  2. Open an existing pet through its Edit Pet action, change its name, birth date, and type, and submit.
    - expect: The update succeeds.
    - expect: The owner profile shows the changed pet data and retains the pet's visit history.

### 4. Visit Recording

**Seed:** `tests/seed.spec.ts`

#### 4.1. Record a visit for a pet

**File:** `tests/petclinic/create-visit.spec.ts`

**Steps:**
  1. Open a pet's Add Visit flow.
    - expect: The New Visit page identifies the pet and owner and shows Date and Description fields.
    - expect: The date field is populated with the application default/current date behavior.
    - expect: Previous Visits is displayed, including existing history when present.
  2. Submit a valid visit date and a nonblank description such as "Annual wellness exam".
    - expect: The visit is saved successfully.
    - expect: The pet's owner profile shows the new visit with the submitted date and description.
    - expect: Existing visits remain present and ordered according to the application's behavior.

#### 4.2. Reject invalid visit data

**File:** `tests/petclinic/visit-validation.spec.ts`

**Steps:**
  1. Open Add Visit and submit with an empty description.
    - expect: The form remains on New Visit.
    - expect: The Description field displays a required validation message such as "must not be blank".
    - expect: No visit is added to Previous Visits or the owner profile.
  2. Submit malformed, empty, and boundary dates, including an invalid calendar date and a date outside the supported format.
    - expect: Invalid date input is rejected with an actionable validation message.
    - expect: No invalid visit is persisted.
    - expect: A valid date and nonblank description can subsequently be submitted successfully.

### 5. Validation and Robustness

**Seed:** `tests/seed.spec.ts`

#### 5.1. Validate required owner fields and telephone format

**File:** `tests/petclinic/owner-validation.spec.ts`

**Steps:**
  1. Open Add Owner and submit the completely blank form.
    - expect: The form remains visible.
    - expect: First Name, Last Name, Address, and City each show a required message.
    - expect: Telephone shows required validation and the 10-digit-number constraint.
    - expect: No owner is created.
  2. Submit values with whitespace-only required fields, nonnumeric telephone data, 9-digit data, 11-digit data, and a valid 10-digit number.
    - expect: Whitespace-only and incorrectly sized or formatted telephone values are rejected.
    - expect: Valid trimmed values with a 10-digit telephone are accepted.
    - expect: Validation messages are associated with the correct fields and do not clear unrelated input.

#### 5.2. Validate required pet fields and date/type inputs

**File:** `tests/petclinic/pet-validation.spec.ts`

**Steps:**
  1. Open Add New Pet and submit with blank name and blank birth date.
    - expect: The form remains visible.
    - expect: Name and Birth Date each display required validation.
    - expect: The owner context and type selector remain intact and no pet is created.
  2. Submit invalid date formats, impossible calendar dates, future/past boundary dates, and an unsupported type value if the request can be manipulated.
    - expect: Invalid birth dates are rejected consistently.
    - expect: Only the supported type options can be selected or persisted.
    - expect: Valid data can be submitted after correcting the errors.

#### 5.3. Handle missing records and direct-route failures

**File:** `tests/petclinic/route-robustness.spec.ts`

**Steps:**
  1. Navigate directly to nonexistent owner, pet, and visit identifiers and to malformed route variants.
    - expect: The application presents its configured not-found/error behavior without exposing a stack trace.
    - expect: Global navigation remains usable where the error template supports it.
    - expect: No existing record is modified.
