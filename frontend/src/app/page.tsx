export default function Home() {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/signup');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  return (
    <>
      
    </>
  );
}