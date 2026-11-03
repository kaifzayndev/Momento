import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Unified Login Page and Authentication Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders unified login page on initial load with user and admin options', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { name: /momento login/i });
    expect(headingElement).toBeInTheDocument();

    const userTab = screen.getByRole('tab', { name: /user login/i });
    const adminTab = screen.getByRole('tab', { name: /admin login/i });
    expect(userTab).toBeInTheDocument();
    expect(adminTab).toBeInTheDocument();

    // Default to User Login
    expect(screen.getByText(/user access:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter as user/i })).toBeInTheDocument();
  });

  test('switches between User Login and Admin Login tabs seamlessly', () => {
    render(<App />);

    const adminTab = screen.getByRole('tab', { name: /admin login/i });
    fireEvent.click(adminTab);

    expect(screen.getByText(/admin access:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter as administrator/i })).toBeInTheDocument();

    const userTab = screen.getByRole('tab', { name: /user login/i });
    fireEvent.click(userTab);

    expect(screen.getByText(/user access:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter as user/i })).toBeInTheDocument();
  });

  test('user login opens gallery and dropdown contains My Collection and Logout', () => {
    localStorage.setItem('ff-user-auth', 'true');
    localStorage.setItem('ff-user-email', 'contactj@gmail.com');

    render(<App />);

    // User is logged in, header shows user dropdown trigger
    expect(screen.getAllByText('contactj@gmail.com').length).toBeGreaterThanOrEqual(1);

    // Verify dropdown items (only My Collection and Logout inside user dropdown)
    expect(screen.getByRole('button', { name: /my collection/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

    // Verify Favourites remains separately in the navbar
    expect(screen.getByRole('button', { name: /toggle favourites filter/i })).toBeInTheDocument();

    // Navigate to My Collection
    const myCollectionBtn = screen.getByRole('button', { name: /my collection/i });
    fireEvent.click(myCollectionBtn);

    expect(screen.getByRole('heading', { name: /my collection/i })).toBeInTheDocument();
    expect(screen.getAllByText(/photo id: #/i).length).toBeGreaterThan(0);

    // Verify Favourites Saved button is clickable and toggles active state
    const favsBtn = screen.getByRole('button', { name: /favourites saved/i });
    expect(favsBtn).toBeInTheDocument();
    fireEvent.click(favsBtn);
    expect(favsBtn).toHaveClass('stat-active-fav');
  });

  test('clicking Momento logo or footer brand scrolls to top and resets gallery to starting view', () => {
    localStorage.setItem('ff-user-auth', 'true');
    localStorage.setItem('ff-user-email', 'contactj@gmail.com');

    render(<App />);

    // Header logo should have accessible name Momento Home
    const headerLogo = screen.getByRole('link', { name: /momento home/i });
    expect(headerLogo).toBeInTheDocument();

    // Click header logo
    fireEvent.click(headerLogo);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });

    // Footer brand button
    const footerBrandBtn = screen.getByRole('button', { name: /momento - reload starting view/i });
    expect(footerBrandBtn).toBeInTheDocument();
    fireEvent.click(footerBrandBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
  });

  test('renders download buttons alongside favourites on image cards and handles download click', () => {
    localStorage.setItem('ff-user-auth', 'true');
    localStorage.setItem('ff-user-email', 'contactj@gmail.com');

    render(<App />);

    // Check that download buttons exist for cards (e.g. Download Misty Mountain Sunrise)
    const downloadBtns = screen.getAllByRole('button', { name: /download/i });
    expect(downloadBtns.length).toBeGreaterThan(0);

    // Click the first download button
    fireEvent.click(downloadBtns[0]);
    expect(downloadBtns[0]).toBeInTheDocument();
  });

  test('admin dashboard provides search, category filter, live preview, and quick view link', () => {
    localStorage.setItem('ff-admin-auth', 'true');
    localStorage.setItem('ff-admin-email', 'admin@bwu.edu');

    render(<App />);

    // Navigate to admin dashboard via header link
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    fireEvent.click(dashboardLink);

    // Admin dashboard loads
    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();

    // Verify My Collection and Favourites are not shown for admin
    expect(screen.queryByRole('button', { name: /my collection/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /toggle favourites filter/i })).not.toBeInTheDocument();

    // 1. Search bar in admin table
    const searchInput = screen.getByPlaceholderText(/search by title, photographer, location/i);
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'Misty' } });
    expect(screen.getAllByText(/misty mountain sunrise/i).length).toBeGreaterThanOrEqual(1);

    // 2. Quick "View in Gallery" link exists for photos
    const viewLinks = screen.getAllByRole('link', { name: /view/i });
    expect(viewLinks.length).toBeGreaterThan(0);
    expect(viewLinks[0]).toHaveAttribute('href', expect.stringContaining('/photo/'));

    // 3. Live image preview in Add Photo modal
    const addPhotoBtn = screen.getByRole('button', { name: /\+ add new photo/i });
    fireEvent.click(addPhotoBtn);

    expect(screen.getByRole('heading', { name: /add new photo/i })).toBeInTheDocument();
    expect(screen.getByText(/live preview:/i)).toBeInTheDocument();

    // Enter Image URL to trigger preview
    const urlInput = screen.getByPlaceholderText(/https:\/\/images\.unsplash\.com/i);
    fireEvent.change(urlInput, { target: { value: 'https://images.unsplash.com/test.jpg' } });
    expect(screen.getByAltText(/live preview/i)).toBeInTheDocument();

    // Close Add Photo modal
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    // 4. Click Our Users stat card to inspect registered user emails
    const ourUsersCard = screen.getByRole('button', { name: /click to view all registered users/i });
    expect(ourUsersCard).toBeInTheDocument();
    fireEvent.click(ourUsersCard);

    // Modal opens showing user emails
    expect(screen.getByRole('heading', { name: /our users/i })).toBeInTheDocument();
    expect(screen.getByText('user@bwu.edu')).toBeInTheDocument();
    expect(screen.getByText('contactar2@gmail.com')).toBeInTheDocument();

    // Filter user list by email
    const userSearchInput = screen.getByPlaceholderText(/filter users by email/i);
    fireEvent.change(userSearchInput, { target: { value: 'contactar2' } });
    expect(screen.getByText('contactar2@gmail.com')).toBeInTheDocument();
    expect(screen.queryByText('user@bwu.edu')).not.toBeInTheDocument();

    // Close user list modal
    const closeUsersBtn = screen.getByRole('button', { name: /close user list modal/i });
    fireEvent.click(closeUsersBtn);
    expect(screen.queryByRole('heading', { name: /our users/i })).not.toBeInTheDocument();

    // 5. Click Photographers stat card to inspect photographers & their pictures
    const photographersCard = screen.getByRole('button', { name: /click to view all photographers/i });
    expect(photographersCard).toBeInTheDocument();
    fireEvent.click(photographersCard);

    // Modal opens showing photographers and their pictures
    expect(screen.getByRole('heading', { name: /our photographers/i })).toBeInTheDocument();
    expect(screen.getAllByText('Alex Carter').length).toBeGreaterThanOrEqual(1);

    // Verify photographer search filters correctly
    const photogSearchInput = screen.getByPlaceholderText(/filter by photographer, location, or category/i);
    fireEvent.change(photogSearchInput, { target: { value: 'Alex' } });
    expect(screen.getAllByText('Alex Carter').length).toBeGreaterThanOrEqual(1);

    // Close photographers modal
    const closePhotogBtn = screen.getByRole('button', { name: /close photographers modal/i });
    fireEvent.click(closePhotogBtn);
    expect(screen.queryByRole('heading', { name: /our photographers/i })).not.toBeInTheDocument();
  });
});
