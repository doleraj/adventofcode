package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day19Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return File(fileUri).readLines()
    }

    @Test
    fun test1() {
        assertEquals("ABCDEF", day19(parseFile("2017/day19TestInput.txt"))[0])
    }

    @Test
    fun test1Actual() {
        assertEquals("GEPYAWTMLK", day19(parseFile("2017/day19ActualInput.txt"))[0])
    }

    @Test
    fun test2() {
        assertEquals(38, day19(parseFile("2017/day19TestInput.txt"))[1])
    }

    @Test
    fun test2Actual() {
        assertEquals(17628, day19(parseFile("2017/day19ActualInput.txt"))[1])
    }
}